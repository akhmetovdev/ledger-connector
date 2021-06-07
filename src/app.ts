import Btc from '@ledgerhq/hw-app-btc';
import Eth from '@ledgerhq/hw-app-eth';
import { makeTransport } from './transport';

/**
 *
 * @param withCachedTransport
 */
export async function makeEthApp(withCachedTransport: boolean = true): Promise<Eth> {
  const transport = await makeTransport(withCachedTransport);

  return new Eth(transport);
}

/**
 *
 * @param withCachedTransport
 */
export async function makeBtcApp(withCachedTransport: boolean = true): Promise<Btc> {
  const transport = await makeTransport(withCachedTransport);

  return new Btc(transport);
}
