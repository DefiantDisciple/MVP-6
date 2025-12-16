export const idlFactory = ({ IDL }) => {
  const Escrow = IDL.Record({
    'ref' : IDL.Text,
    'status' : IDL.Text,
    'updated_ts' : IDL.Nat64,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'dispute_id' : IDL.Opt(IDL.Text),
    'created_ts' : IDL.Nat64,
    'tender_id' : IDL.Nat,
    'currency' : IDL.Text,
    'milestone_id' : IDL.Opt(IDL.Text),
    'amount' : IDL.Nat64,
  });
  const EscrowEvent = IDL.Record({
    'id' : IDL.Text,
    'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'description' : IDL.Text,
    'escrow_ref' : IDL.Text,
    'performed_by' : IDL.Text,
    'timestamp' : IDL.Nat64,
    'amount' : IDL.Nat64,
    'event_type' : IDL.Text,
  });
  return IDL.Service({
    'create_escrow' : IDL.Func([IDL.Nat, IDL.Nat64, IDL.Text], [IDL.Text], []),
    'dispute_escrow' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'get_all_escrows' : IDL.Func([], [IDL.Vec(Escrow)], ['query']),
    'get_escrow_details' : IDL.Func([IDL.Text], [IDL.Opt(Escrow)], ['query']),
    'get_escrow_history' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(EscrowEvent)],
        ['query'],
      ),
    'get_escrow_stats' : IDL.Func(
        [],
        [
          IDL.Record({
            'total_amount' : IDL.Nat64,
            'by_status' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)),
            'total_escrows' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'hold_funds' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'mirror_event' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'refund_payment' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'release_payment' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'resolve_dispute' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
