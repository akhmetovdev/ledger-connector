import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';
import WebHidTransport from '@ledgerhq/hw-transport-webhid';
import { UAParser, UAParserInstance } from 'ua-parser-js';
import { LedgerLiveAppName, WEBSOCKET_BRIDGE_URL, WEBSOCKET_CHECK_TIMEOUT } from './constants';
import { MobileDeviceNotSupportedError, NotAvailableError } from './errors';
import { openLedgerLiveApp } from './utils';
import { checkWebSocketRecursively } from './websocket';

/**
 *
 */
let transport: WebSocketTransport | WebHidTransport | null = null;

/**
 *
 */
let uaParser: UAParserInstance | null = null;

/**
 *
 */
let isWebSocketSupportedPromise: Promise<boolean> | null = null;
let isWebHidSupportedPromise: Promise<boolean> | null = null;

/**
 *
 */
if (typeof window != 'undefined') {
  uaParser = new UAParser();
  isWebSocketSupportedPromise = WebSocketTransport.isSupported()
  isWebHidSupportedPromise = WebHidTransport.isSupported();
}

/**
 *
 * @param ledgerLiveAppName
 */
export async function makeTransport(
  ledgerLiveAppName: LedgerLiveAppName
): Promise<WebSocketTransport | WebHidTransport> {
  if (transport) {
    return transport;
  }

  if (uaParser == null || isWebSocketSupportedPromise == null || isWebHidSupportedPromise == null) {
    throw new NotAvailableError('NotAvailable');
  }

  const { type } = uaParser.getDevice();

  if (type && ['mobile', 'tablet'].includes(type)) {
    throw new MobileDeviceNotSupportedError('MobileDeviceNotSupported');
  }

  const [isWebHidSupported, isWebSocketSupported] = await Promise.all([
    isWebHidSupportedPromise,
    isWebSocketSupportedPromise
  ]);

  if (isWebHidSupported) {
    transport = await WebHidTransport.create();

    return transport;
  } else if (isWebSocketSupported) {
    try {
      await WebSocketTransport.check(WEBSOCKET_BRIDGE_URL, WEBSOCKET_CHECK_TIMEOUT);
    } catch {
      openLedgerLiveApp(ledgerLiveAppName);

      await checkWebSocketRecursively();
    }

    transport = await WebSocketTransport.open(WEBSOCKET_BRIDGE_URL);

    return transport;
  }

  throw new NotAvailableError('NotAvailable');
}

/**
 *
 */
export function resetTransport(): void {
  transport = null;
}
