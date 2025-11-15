import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";

persistent actor Core {
  type TenderSummary = {
    tender_id: Nat;
    title: Text;
    closing_ts: Nat64;
  };

  type CreateTenderResult = {
    tender_id: Nat;
  };

  type SubmitBidResult = {
    bid_id: Nat;
  };

  type Tender = {
    id: Nat;
    title: Text;
    description: Text;
    closing_ts: Nat64;
    created_ts: Nat64;
    status: Text; // "open", "closed", "awarded"
  };

  type Bid = {
    id: Nat;
    tender_id: Nat;
    amount: Nat64;
    doc_hash: Text;
    created_ts: Nat64;
  };

  private stable var nextTenderId: Nat = 1;
  private stable var nextBidId: Nat = 1;
  private stable var tendersEntries: [(Nat, Tender)] = [];
  private stable var bidsEntries: [(Nat, Bid)] = [];

  private transient var tenders = Map.HashMap<Nat, Tender>(tendersEntries.size(), Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n) });
  private transient var bids = Map.HashMap<Nat, Bid>(bidsEntries.size(), Nat.equal, func(n: Nat) : Nat32 { Nat32.fromNat(n) });

  system func preupgrade() {
    tendersEntries := Iter.toArray(tenders.entries());
    bidsEntries := Iter.toArray(bids.entries());
  };

  system func postupgrade() {
    for ((key, value) in tendersEntries.vals()) {
      tenders.put(key, value);
    };
    for ((key, value) in bidsEntries.vals()) {
      bids.put(key, value);
    };
    tendersEntries := [];
    bidsEntries := [];
  };

  public func create_tender(title: Text, description: Text, closing_ts: Nat64) : async CreateTenderResult {
    let tender: Tender = {
      id = nextTenderId;
      title = title;
      description = description;
      closing_ts = closing_ts;
      created_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
      status = "open";
    };
    
    tenders.put(nextTenderId, tender);
    let result = { tender_id = nextTenderId };
    nextTenderId += 1;
    result
  };

  public query func list_open_tenders() : async [TenderSummary] {
    let openTenders = Array.filter<(Nat, Tender)>(Iter.toArray(tenders.entries()), func((id, tender)) = tender.status == "open");
    Array.map<(Nat, Tender), TenderSummary>(openTenders, func((id, tender)) = {
      tender_id = tender.id;
      title = tender.title;
      closing_ts = tender.closing_ts;
    })
  };

  public func submit_bid(tender_id: Nat, amount: Nat64, doc_hash: Text) : async SubmitBidResult {
    let bid: Bid = {
      id = nextBidId;
      tender_id = tender_id;
      amount = amount;
      doc_hash = doc_hash;
      created_ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
    };
    
    bids.put(nextBidId, bid);
    let result = { bid_id = nextBidId };
    nextBidId += 1;
    result
  };

  public func award_tender(tender_id: Nat, winner_bid_id: Nat) : async Bool {
    switch (tenders.get(tender_id)) {
      case (?tender) {
        let updatedTender = {
          id = tender.id;
          title = tender.title;
          description = tender.description;
          closing_ts = tender.closing_ts;
          created_ts = tender.created_ts;
          status = "awarded";
        };
        tenders.put(tender_id, updatedTender);
        true
      };
      case null { false };
    }
  };
}
