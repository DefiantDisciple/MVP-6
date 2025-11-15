import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";

persistent actor EscrowAdapter {
  
  // Enhanced escrow record with comprehensive fields
  type Escrow = {
    ref: Text;
    tender_id: Nat;
    amount: Nat64;
    currency: Text;
    status: Text; // "created", "held", "released", "refunded", "disputed", "resolved"
    created_ts: Nat64;
    updated_ts: Nat64;
    milestone_id: ?Text;
    dispute_id: ?Text;
    metadata: [(Text, Text)];
  };

  // Escrow event for audit trail
  type EscrowEvent = {
    id: Text;
    escrow_ref: Text;
    event_type: Text; // "deposit", "hold", "release", "refund", "dispute"
    amount: Nat64;
    timestamp: Nat64;
    performed_by: Text;
    description: Text;
    metadata: [(Text, Text)];
  };

  // Stable variables for persistence
  private stable var nextEscrowId: Nat = 1;
  private stable var nextEventId: Nat = 1;
  private stable var escrowsEntries: [(Text, Escrow)] = [];
  private stable var eventsEntries: [(Text, EscrowEvent)] = [];

  // Transient hashmaps for runtime operations
  private transient var escrows = Map.HashMap<Text, Escrow>(escrowsEntries.size(), Text.equal, Text.hash);
  private transient var events = Map.HashMap<Text, EscrowEvent>(eventsEntries.size(), Text.equal, Text.hash);

  // Upgrade hooks for persistence
  system func preupgrade() {
    escrowsEntries := Iter.toArray(escrows.entries());
    eventsEntries := Iter.toArray(events.entries());
  };

  system func postupgrade() {
    for ((key, value) in escrowsEntries.vals()) {
      escrows.put(key, value);
    };
    for ((key, value) in eventsEntries.vals()) {
      events.put(key, value);
    };
    escrowsEntries := [];
    eventsEntries := [];
  };

  // Helper function to create event
  private func createEvent(escrow_ref: Text, event_type: Text, amount: Nat64, performed_by: Text, description: Text) : Text {
    let event_id = "EVT-" # Nat.toText(nextEventId);
    let event: EscrowEvent = {
      id = event_id;
      escrow_ref = escrow_ref;
      event_type = event_type;
      amount = amount;
      timestamp = Nat64.fromNat(Int.abs(Time.now() / 1000000));
      performed_by = performed_by;
      description = description;
      metadata = [];
    };
    events.put(event_id, event);
    nextEventId += 1;
    event_id
  };

  // Create a new escrow
  public func create_escrow(tender_id: Nat, amount: Nat64, currency: Text) : async Text {
    let escrow_ref = "ESC-" # Nat.toText(nextEscrowId) # "-" # Nat.toText(tender_id);
    let timestamp = Nat64.fromNat(Int.abs(Time.now() / 1000000));
    
    let escrow: Escrow = {
      ref = escrow_ref;
      tender_id = tender_id;
      amount = amount;
      currency = currency;
      status = "created";
      created_ts = timestamp;
      updated_ts = timestamp;
      milestone_id = null;
      dispute_id = null;
      metadata = [];
    };
    
    escrows.put(escrow_ref, escrow);
    nextEscrowId += 1;
    
    // Create deposit event
    ignore createEvent(escrow_ref, "deposit", amount, "system", "Escrow created for tender " # Nat.toText(tender_id));
    
    escrow_ref
  };

  // Release payment from escrow
  public func release_payment(escrow_ref: Text) : async Bool {
    switch (escrows.get(escrow_ref)) {
      case (?escrow) {
        if (escrow.status == "created" or escrow.status == "held") {
          let updatedEscrow = {
            ref = escrow.ref;
            tender_id = escrow.tender_id;
            amount = escrow.amount;
            currency = escrow.currency;
            status = "released";
            created_ts = escrow.created_ts;
            updated_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
            milestone_id = escrow.milestone_id;
            dispute_id = escrow.dispute_id;
            metadata = escrow.metadata;
          };
          escrows.put(escrow_ref, updatedEscrow);
          
          // Create release event
          ignore createEvent(escrow_ref, "release", escrow.amount, "system", "Payment released from escrow");
          
          true
        } else {
          false // Cannot release if not in correct status
        }
      };
      case null { false };
    }
  };

  // Hold funds for milestone-based payments
  public func hold_funds(escrow_ref: Text, milestone_id: Text) : async Bool {
    switch (escrows.get(escrow_ref)) {
      case (?escrow) {
        if (escrow.status == "created") {
          let updatedEscrow = {
            ref = escrow.ref;
            tender_id = escrow.tender_id;
            amount = escrow.amount;
            currency = escrow.currency;
            status = "held";
            created_ts = escrow.created_ts;
            updated_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
            milestone_id = ?milestone_id;
            dispute_id = escrow.dispute_id;
            metadata = escrow.metadata;
          };
          escrows.put(escrow_ref, updatedEscrow);
          
          // Create hold event
          ignore createEvent(escrow_ref, "hold", escrow.amount, "system", "Funds held for milestone " # milestone_id);
          
          true
        } else {
          false
        }
      };
      case null { false };
    }
  };

  // Refund payment
  public func refund_payment(escrow_ref: Text, reason: Text) : async Bool {
    switch (escrows.get(escrow_ref)) {
      case (?escrow) {
        if (escrow.status == "created" or escrow.status == "held" or escrow.status == "disputed") {
          let updatedEscrow = {
            ref = escrow.ref;
            tender_id = escrow.tender_id;
            amount = escrow.amount;
            currency = escrow.currency;
            status = "refunded";
            created_ts = escrow.created_ts;
            updated_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
            milestone_id = escrow.milestone_id;
            dispute_id = escrow.dispute_id;
            metadata = escrow.metadata;
          };
          escrows.put(escrow_ref, updatedEscrow);
          
          // Create refund event
          ignore createEvent(escrow_ref, "refund", escrow.amount, "system", "Payment refunded: " # reason);
          
          true
        } else {
          false
        }
      };
      case null { false };
    }
  };

  // Dispute escrow
  public func dispute_escrow(escrow_ref: Text, dispute_id: Text) : async Bool {
    switch (escrows.get(escrow_ref)) {
      case (?escrow) {
        if (escrow.status != "released" and escrow.status != "refunded") {
          let updatedEscrow = {
            ref = escrow.ref;
            tender_id = escrow.tender_id;
            amount = escrow.amount;
            currency = escrow.currency;
            status = "disputed";
            created_ts = escrow.created_ts;
            updated_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
            milestone_id = escrow.milestone_id;
            dispute_id = ?dispute_id;
            metadata = escrow.metadata;
          };
          escrows.put(escrow_ref, updatedEscrow);
          
          // Create dispute event
          ignore createEvent(escrow_ref, "dispute", 0, "system", "Escrow disputed: " # dispute_id);
          
          true
        } else {
          false
        }
      };
      case null { false };
    }
  };

  // Resolve dispute
  public func resolve_dispute(escrow_ref: Text, resolution: Text) : async Bool {
    switch (escrows.get(escrow_ref)) {
      case (?escrow) {
        if (escrow.status == "disputed") {
          let updatedEscrow = {
            ref = escrow.ref;
            tender_id = escrow.tender_id;
            amount = escrow.amount;
            currency = escrow.currency;
            status = "resolved";
            created_ts = escrow.created_ts;
            updated_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
            milestone_id = escrow.milestone_id;
            dispute_id = escrow.dispute_id;
            metadata = escrow.metadata;
          };
          escrows.put(escrow_ref, updatedEscrow);
          
          // Create resolution event
          ignore createEvent(escrow_ref, "resolve", 0, "system", "Dispute resolved: " # resolution);
          
          true
        } else {
          false
        }
      };
      case null { false };
    }
  };

  // Get escrow details
  public query func get_escrow_details(escrow_ref: Text) : async ?Escrow {
    escrows.get(escrow_ref)
  };

  // Get escrow history for a tender
  public query func get_escrow_history(tender_id: Nat) : async [EscrowEvent] {
    let buffer = Buffer.Buffer<EscrowEvent>(0);
    
    for ((_, event) in events.entries()) {
      // Check if event belongs to escrows of this tender
      switch (escrows.get(event.escrow_ref)) {
        case (?escrow) {
          if (escrow.tender_id == tender_id) {
            buffer.add(event);
          };
        };
        case null {};
      };
    };
    
    Buffer.toArray(buffer)
  };

  // Mirror event to external systems (webhook, logging, etc.)
  public func mirror_event(kind: Text, payload: Text) : async Bool {
    // In production, this would integrate with external systems
    // For now, we just log the event
    ignore createEvent("SYSTEM", kind, 0, "external", payload);
    true
  };

  // Get all escrows (admin function)
  public query func get_all_escrows() : async [Escrow] {
    let buffer = Buffer.Buffer<Escrow>(escrows.size());
    for ((_, escrow) in escrows.entries()) {
      buffer.add(escrow);
    };
    Buffer.toArray(buffer)
  };

  // Get escrow statistics
  public query func get_escrow_stats() : async {
    total_escrows: Nat;
    total_amount: Nat64;
    by_status: [(Text, Nat)];
  } {
    let total_escrows = escrows.size();
    var total_amount: Nat64 = 0;
    let status_map = Map.HashMap<Text, Nat>(10, Text.equal, Text.hash);

    for ((_, escrow) in escrows.entries()) {
      total_amount += escrow.amount;
      
      switch (status_map.get(escrow.status)) {
        case (?count) { status_map.put(escrow.status, count + 1); };
        case null { status_map.put(escrow.status, 1); };
      };
    };

    {
      total_escrows = total_escrows;
      total_amount = total_amount;
      by_status = Iter.toArray(status_map.entries());
    }
  };
}
