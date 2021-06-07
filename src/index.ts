import Btc from '@ledgerhq/hw-app-btc';
import Eth from '@ledgerhq/hw-app-eth';
import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';
import WebHidTransport from '@ledgerhq/hw-transport-webhid';

// @ts-ignore
export * from './types';
export * from './app';
export * from './constants';
export * from './errors';
export * from './transport';
export { Btc, Eth, WebSocketTransport, WebHidTransport };
export type LedgerTransport = WebSocketTransport | WebHidTransport;
