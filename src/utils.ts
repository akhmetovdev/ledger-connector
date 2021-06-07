import { LedgerLiveAppName } from './constants';

/**
 *
 * @param ms
 */
export async function delay(ms: number): Promise<void> {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

/**
 *
 * @param ledgerLiveAppName
 */
export function openLedgerLiveApp(ledgerLiveAppName: LedgerLiveAppName): void {
  window.open(`ledgerlive://bridge?appName=${encodeURI(ledgerLiveAppName)}`);
}
