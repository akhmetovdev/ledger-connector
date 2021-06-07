import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';
import WebHidTransport from '@ledgerhq/hw-transport-webhid';
import { UAParser, UAParserInstance } from 'ua-parser-js';
import { LedgerLiveAppName, WEBSOCKET_BRIDGE_URL, WEBSOCKET_CHECK_TIMEOUT } from './constants';
import { MobileDeviceNotSupportedError, NotAvailableError, SafariNotSupportedError } from './errors';
import { openLedgerLiveApp } from './utils';
import { checkWebSocketRecursively } from './websocket';

/**
 *
 */
let cachedTransport: WebSocketTransport | WebHidTransport | null = null;

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
  isWebSocketSupportedPromise = WebSocketTransport.isSupported();
  isWebHidSupportedPromise = WebHidTransport.isSupported();
}

/**
 *
 * @param ledgerLiveAppName
 */
export async function makeTransport(
  ledgerLiveAppName: LedgerLiveAppName
): Promise<WebSocketTransport | WebHidTransport> {
  if (cachedTransport) {
    if (__DEV__) {
      console.log(`[ledger-connector] returned cached transport`);
    }

    return cachedTransport;
  }

  if (uaParser == null || isWebSocketSupportedPromise == null || isWebHidSupportedPromise == null) {
    if (__DEV__) {
      console.log(
        `[ledger-connector] not available: ${JSON.stringify({
          uaParser: uaParser == null,
          isWebSocketSupportedPromise: isWebSocketSupportedPromise == null,
          isWebHidSupportedPromise: isWebHidSupportedPromise == null
        })}`
      );
    }

    throw new NotAvailableError('NotAvailable');
  }

  const { type: deviceType } = uaParser.getDevice();
  const { name: browserName } = uaParser.getBrowser();

  if (__DEV__) {
    console.log(`[ledger-connector] user agent parser: ${JSON.stringify({ deviceType, browserName })}`);
  }

  if (deviceType && ['mobile', 'tablet'].includes(deviceType)) {
    throw new MobileDeviceNotSupportedError('MobileDeviceNotSupported');
  }

  if (browserName && browserName.toLowerCase().includes('safari')) {
    throw new SafariNotSupportedError('SafariNotSupported');
  }

  const [isWebHidSupported, isWebSocketSupported] = await Promise.all([
    isWebHidSupportedPromise,
    isWebSocketSupportedPromise
  ]);

  if (__DEV__) {
    console.log(`[ledger-connector] supported: ${JSON.stringify({ isWebHidSupported, isWebSocketSupportedPromise })}`);
  }

  if (isWebHidSupported) {
    cachedTransport = await WebHidTransport.create();

    if (__DEV__) {
      console.log(`[ledger-connector] created WebHID transport:`, cachedTransport);
    }

    return cachedTransport;
  } else if (isWebSocketSupported) {
    try {
      await WebSocketTransport.check(WEBSOCKET_BRIDGE_URL, WEBSOCKET_CHECK_TIMEOUT);
    } catch {
      openLedgerLiveApp(ledgerLiveAppName);

      await checkWebSocketRecursively();
    }

    cachedTransport = await WebSocketTransport.open(WEBSOCKET_BRIDGE_URL);

    if (__DEV__) {
      console.log(`[ledger-connector] created WebSocket transport:`, cachedTransport);
    }

    return cachedTransport;
  }

  throw new NotAvailableError('NotAvailable');
}

/**
 *
 * @param transport
 */
export function resetTransport(transport?: WebSocketTransport | WebHidTransport): void {
  if (transport) {
    void transport.close();
  }

  cachedTransport = null;
}
