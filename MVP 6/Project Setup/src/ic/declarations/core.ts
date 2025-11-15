export const idlFactory = ({ IDL }: any) => {
  const TenderSummary = IDL.Record({
    'tender_id' : IDL.Nat,
    'title' : IDL.Text,
    'closing_ts' : IDL.Nat64,
  });
  const CreateTenderResult = IDL.Record({ 'tender_id' : IDL.Nat });
  const SubmitBidResult = IDL.Record({ 'bid_id' : IDL.Nat });
  return IDL.Service({
    'award_tender' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Bool], []),
    'create_tender' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat64],
        [CreateTenderResult],
        [],
      ),
    'list_open_tenders' : IDL.Func([], [IDL.Vec(TenderSummary)], ['query']),
    'submit_bid' : IDL.Func(
        [IDL.Nat, IDL.Nat64, IDL.Text],
        [SubmitBidResult],
        [],
      ),
  });
};
