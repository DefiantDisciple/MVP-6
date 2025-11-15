export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'create_escrow' : IDL.Func([IDL.Nat, IDL.Nat64, IDL.Text], [IDL.Text], []),
    'mirror_event' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'release_payment' : IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
