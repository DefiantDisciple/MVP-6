export const idlFactory = ({ IDL }) => {
  const AuditEvent = IDL.Record({
    'ts' : IDL.Nat64,
    'source' : IDL.Text,
    'data' : IDL.Text,
    'kind' : IDL.Text,
  });
  return IDL.Service({
    'append_event' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'get_events' : IDL.Func([IDL.Nat], [IDL.Vec(AuditEvent)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
