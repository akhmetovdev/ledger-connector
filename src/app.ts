import Btc from '@ledgerhq/hw-app-btc';
import Eth from '@ledgerhq/hw-app-eth';
import { LedgerLiveAppName } from './constants';
import { makeTransport } from './transport';

/**
 *
 */
export async function makeEthApp(): Promise<Eth> {
  const transport = await makeTransport(LedgerLiveAppName.ETHEREUM);

  return new Eth(transport);
}

/**
 *
 * @param ledgerLiveAppName
 */
export async function makeBtcApp(ledgerLiveAppName: LedgerLiveAppName): Promise<Btc> {
  const transport = await makeTransport(ledgerLiveAppName);

  return new Btc(transport);
}
