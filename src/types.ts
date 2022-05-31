/**
 *
 */
declare module '@ledgerhq/hw-transport-u2f' {
  import Transport from '@ledgerhq/hw-transport';

  export default class U2FTransport extends Transport {}
}

/**
 *
 */
declare module 'ledger-cosmos-js' {
  import Luna from '@terra-money/ledger-terra-js/dist/app';

  export default class Atom {
    constructor(transport: any);

    publicKey: Luna['getPublicKey'];
    getAddressAndPubKey: Luna['getAddressAndPubKey'];
    sign: Luna['sign'];
  }
}
