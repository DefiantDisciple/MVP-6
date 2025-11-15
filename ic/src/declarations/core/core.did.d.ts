import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface CreateTenderResult { 'tender_id' : bigint }
export interface SubmitBidResult { 'bid_id' : bigint }
export interface TenderSummary {
  'title' : string,
  'closing_ts' : bigint,
  'tender_id' : bigint,
}
export interface _SERVICE {
  'award_tender' : ActorMethod<[bigint, bigint], boolean>,
  'create_tender' : ActorMethod<[string, string, bigint], CreateTenderResult>,
  'list_open_tenders' : ActorMethod<[], Array<TenderSummary>>,
  'submit_bid' : ActorMethod<[bigint, bigint, string], SubmitBidResult>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
