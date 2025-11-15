import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AuditEvent {
  'ts' : bigint,
  'source' : string,
  'data' : string,
  'kind' : string,
}
export interface _SERVICE {
  'append_event' : ActorMethod<[string, string, string], boolean>,
  'get_events' : ActorMethod<[bigint], Array<AuditEvent>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
