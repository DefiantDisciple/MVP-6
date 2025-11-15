import Array "mo:base/Array";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";

persistent actor Audit {
  type AuditEvent = {
    ts: Nat64;
    source: Text;
    kind: Text;
    data: Text;
  };

  private stable var eventsArray: [AuditEvent] = [];
  private transient var events = Buffer.fromArray<AuditEvent>(eventsArray);

  system func preupgrade() {
    eventsArray := Buffer.toArray(events);
  };

  system func postupgrade() {
    eventsArray := [];
  };

  public func append_event(source: Text, kind: Text, data: Text) : async Bool {
    let event: AuditEvent = {
      ts = Nat64.fromNat(Int.abs(Time.now() / 1000000));
      source = source;
      kind = kind;
      data = data;
    };
    
    events.add(event);
    true
  };

  public query func get_events(limit: Nat) : async [AuditEvent] {
    let eventsArray = Buffer.toArray(events);
    let size = eventsArray.size();
    let startIndex = if (size >= limit) { size - limit } else { 0 };
    Array.tabulate<AuditEvent>(size - startIndex, func(i) = eventsArray[startIndex + i])
  };
}
