import U2FTransport from '@ledgerhq/hw-transport-u2f';
import WebHidTransport from '@ledgerhq/hw-transport-webhid';
import { UAParser, UAParserInstance } from 'ua-parser-js';
import { MobileDeviceNotSupportedError, NotAvailableError, SafariNotSupportedError } from './errors';

/**
 *
 */
let cachedTransport: LedgerTransport | null = null;

/**
 *
 */
let uaParser: UAParserInstance | null = null;

/**
 *
 */
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
 * @param withCachedTransport
 */
export async function makeTransport(withCachedTransport: boolean = true): Promise<LedgerTransport> {
  if (cachedTransport && withCachedTransport) {
    if (__DEV__) {
      console.log(`[ledger-connector] returned cached transport:`, cachedTransport);
    }

    return cachedTransport;
  }

  if (uaParser == null || isWebHidSupportedPromise == null) {
    if (__DEV__) {
      const notAvailable = {
        uaParser: uaParser == null,
        isWebHidSupportedPromise: isWebHidSupportedPromise == null
      };

      console.log(`[ledger-connector] not available: ${JSON.stringify(notAvailable)}`);
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

  const isWebHidSupported = await isWebHidSupportedPromise;

  if (__DEV__) {
    console.log(`[ledger-connector] supported: ${JSON.stringify({ isWebHidSupported })}`);
  }

  if (cachedTransport) {
    await resetTransport(cachedTransport);
  }

  if (isWebHidSupported) {
    cachedTransport = await WebHidTransport.create();

    if (__DEV__) {
      console.log(`[ledger-connector] created WebHID transport:`, cachedTransport);
    }

    return cachedTransport;
  } else {
    cachedTransport = await U2FTransport.create();

    if (__DEV__) {
      console.log(`[ledger-connector] created U2F transport:`, cachedTransport);
    }

    return cachedTransport;
  }
}

/**
 *
 * @param transport
 */
export async function resetTransport(transport?: LedgerTransport): Promise<void> {
  if (transport) {
    await transport.close().catch(() => {});
  }

  cachedTransport = null;
}
