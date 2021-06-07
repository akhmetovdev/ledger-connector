import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';
import WebHidTransport from '@ledgerhq/hw-transport-webhid';
import { UAParser, UAParserInstance } from 'ua-parser-js';
import { LedgerLiveAppName, WEBSOCKET_BRIDGE_URL } from './constants';
import { MobileDeviceNotSupportedError, NotAvailableError } from './errors';
import { openLedgerLiveApp } from './utils';
import { checkWebSocket, checkWebSocketRecursively } from './websocket';

/**
 *
 */
let transport: WebSocketTransport | WebHidTransport | null = null;
let uaParser: UAParserInstance | null = null;
let isWebHidSupportedPromise: Promise<boolean> | null = null;

/**
 *
 */
if (typeof window != 'undefined') {
  uaParser = new UAParser();
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

  if (uaParser == null || isWebHidSupportedPromise == null) {
    throw new NotAvailableError();
  }

  const { type } = uaParser.getDevice();

  if (type && ['mobile', 'tablet'].includes(type)) {
    throw new MobileDeviceNotSupportedError();
  }

  const isWebHidSupported = await isWebHidSupportedPromise;

  if (isWebHidSupported) {
    transport = await WebHidTransport.create();

    return transport;
  } else {
    try {
      await checkWebSocket();
    } catch {
      openLedgerLiveApp(ledgerLiveAppName);

      await checkWebSocketRecursively();
    }

    return await WebSocketTransport.open(WEBSOCKET_BRIDGE_URL);
  }
}

/**
 *
 */
export function resetTransport(): void {
  transport = null;
}
