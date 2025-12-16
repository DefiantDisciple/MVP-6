import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Escrow {
  'ref' : string,
  'status' : string,
  'updated_ts' : bigint,
  'metadata' : Array<[string, string]>,
  'dispute_id' : [] | [string],
  'created_ts' : bigint,
  'tender_id' : bigint,
  'currency' : string,
  'milestone_id' : [] | [string],
  'amount' : bigint,
}
export interface EscrowEvent {
  'id' : string,
  'metadata' : Array<[string, string]>,
  'description' : string,
  'escrow_ref' : string,
  'performed_by' : string,
  'timestamp' : bigint,
  'amount' : bigint,
  'event_type' : string,
}
export interface _SERVICE {
  'create_escrow' : ActorMethod<[bigint, bigint, string], string>,
  'dispute_escrow' : ActorMethod<[string, string], boolean>,
  'get_all_escrows' : ActorMethod<[], Array<Escrow>>,
  'get_escrow_details' : ActorMethod<[string], [] | [Escrow]>,
  'get_escrow_history' : ActorMethod<[bigint], Array<EscrowEvent>>,
  'get_escrow_stats' : ActorMethod<
    [],
    {
      'total_amount' : bigint,
      'by_status' : Array<[string, bigint]>,
      'total_escrows' : bigint,
    }
  >,
  'hold_funds' : ActorMethod<[string, string], boolean>,
  'mirror_event' : ActorMethod<[string, string], boolean>,
  'refund_payment' : ActorMethod<[string, string], boolean>,
  'release_payment' : ActorMethod<[string], boolean>,
  'resolve_dispute' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
