interface Signature<V extends number | string> {
  v: V;
  r: string;
  s: string;
}

interface LedgerTransport {
  device?: {
    productName?: 'Nano X' | 'Nano S' | string;
  };

  close(): Promise<void>;
}

declare module '@ledgerhq/hw-transport-u2f' {
  export default class U2FTransport implements LedgerTransport {
    public static create(): Promise<LedgerTransport>;

    public close(): Promise<void>;
  }
}

declare module '@ledgerhq/hw-transport-webhid' {
  export default class WebHidTransport implements LedgerTransport {
    device: {
      productName: 'Nano X' | 'Nano S' | string;
    };

    public static create(): Promise<LedgerTransport>;

    public static isSupported(): Promise<boolean>;

    public close(): Promise<void>;
  }
}

declare module '@ledgerhq/hw-app-eth' {
  export default class Eth {
    public transport: LedgerTransport;

    constructor(transport: LedgerTransport);

    public getAddress(
      path: string,
      boolDisplay?: boolean,
      boolChaincode?: boolean
    ): Promise<{ publicKey: string; address: string; chainCode?: string }>;

    public signTransaction(path: string, rawTxHex: string): Promise<Signature<string>>;

    public getAppConfiguration(): Promise<{
      arbitraryDataEnabled: number;
      erc20ProvisioningNecessary: number;
      starkEnabled: number;
      starkv2Supported: number;
      version: string;
    }>;

    public signPersonalMessage(path: string, messageHex: string): Promise<Signature<number>>;

    public eth2GetPublicKey(path: string, boolDisplay?: boolean): Promise<{ publicKey: string }>;

    public eth2SetWithdrawalIndex(withdrawalIndex: number): Promise<boolean>;
  }
}

declare module '@ledgerhq/hw-app-btc' {
  export default class Btc {
    public transport: LedgerTransport;

    constructor(transport: LedgerTransport);

    public getWalletPublicKey(
      path: string,
      opts?: boolean | { verify?: boolean; format?: 'legacy' | 'p2sh' | 'bech32' | 'cashaddr' }
    ): Promise<{ publicKey: string; bitcoinAddress: string; chainCode: string }>;

    public signMessageNew(path: string, messageHex: string): Promise<Signature<string>>;
  }
}
