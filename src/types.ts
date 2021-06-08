interface Signature<V extends number | string> {
  v: V;
  r: string;
  s: string;
}

interface LedgerTransport<T extends string = string> {
  device?: {
    productName?: 'Nano X' | 'Nano S' | string;
  };

  setScrambleKey(key: T): void;

  send(cla: number, ins: number, p1: number, p2: number, data?: Buffer, statusList?: number[]): Promise<Buffer>;

  close(): Promise<void>;
}

declare module '@ledgerhq/hw-transport-u2f' {
  export default class U2FTransport<T extends string = string> implements LedgerTransport<T> {
    public static create(): Promise<LedgerTransport>;

    public setScrambleKey(key: T): void;

    public send(
      cla: number,
      ins: number,
      p1: number,
      p2: number,
      data?: Buffer,
      statusList?: number[]
    ): Promise<Buffer>;

    public close(): Promise<void>;
  }
}

declare module '@ledgerhq/hw-transport-webhid' {
  export default class WebHidTransport<T extends string = string> implements LedgerTransport<T> {
    device: {
      productName: 'Nano X' | 'Nano S' | string;
    };

    public static create(): Promise<LedgerTransport>;

    public static isSupported(): Promise<boolean>;

    public setScrambleKey(key: T): void;

    public send(
      cla: number,
      ins: number,
      p1: number,
      p2: number,
      data?: Buffer,
      statusList?: number[]
    ): Promise<Buffer>;

    public close(): Promise<void>;
  }
}

declare module '@ledgerhq/hw-app-eth' {
  export default class Eth {
    public transport: LedgerTransport<'ETH'>;

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
    public transport: LedgerTransport<'BTC'>;

    constructor(transport: LedgerTransport);

    public getWalletPublicKey(
      path: string,
      opts?: boolean | { verify?: boolean; format?: 'legacy' | 'p2sh' | 'bech32' | 'cashaddr' }
    ): Promise<{ publicKey: string; bitcoinAddress: string; chainCode: string }>;

    public signMessageNew(path: string, messageHex: string): Promise<Signature<number>>;
  }
}
