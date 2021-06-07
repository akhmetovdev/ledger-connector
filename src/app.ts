import Btc from '@ledgerhq/hw-app-btc';
import Eth from '@ledgerhq/hw-app-eth';
import { LedgerLiveAppName } from './constants';
import { makeTransport } from './transport';

/**
 *
 * @param withCachedTransport
 */
export async function makeEthApp(withCachedTransport: boolean = true): Promise<Eth> {
  const transport = await makeTransport(LedgerLiveAppName.ETH, withCachedTransport);

  return new Eth(transport);
}

/**
 *
 * @param ledgerLiveAppName
 * @param withCachedTransport
 */
export async function makeBtcApp(
  ledgerLiveAppName: LedgerLiveAppName,
  withCachedTransport: boolean = true
): Promise<Btc> {
  const transport = await makeTransport(ledgerLiveAppName, withCachedTransport);

  return new Btc(transport);
}
