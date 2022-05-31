import Ada from '@cardano-foundation/ledgerjs-hw-app-cardano';
import Btc from '@ledgerhq/hw-app-btc';
import Eth from '@ledgerhq/hw-app-eth';
import Luna from '@terra-money/ledger-terra-js';
import Atom from 'ledger-cosmos-js';
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

/**
 *
 * @param withCachedTransport
 */
export async function makeAdaApp(withCachedTransport: boolean = true): Promise<Ada> {
  const transport = await makeTransport(withCachedTransport);

  return new Ada(transport);
}

/**
 *
 * @param withCachedTransport
 */
export async function makeAtomApp(withCachedTransport: boolean = true): Promise<Atom> {
  const transport = await makeTransport(withCachedTransport);

  return new Atom(transport);
}

/**
 *
 * @param withCachedTransport
 */
export async function makeLunaApp(withCachedTransport: boolean = true): Promise<Luna> {
  const transport = await makeTransport(withCachedTransport);

  return new Luna(transport);
}
