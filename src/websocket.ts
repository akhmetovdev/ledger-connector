import WebSocketTransport from '@ledgerhq/hw-transport-http/lib/WebSocketTransport';
import * as Constants from './constants';
import { TimeoutError } from './errors';
import { delay } from './utils';

/**
 *
 * @param iterator
 */
export async function checkWebSocketRecursively(iterator = 0): Promise<void> {
  return await WebSocketTransport.check(Constants.WEBSOCKET_BRIDGE_URL, Constants.WEBSOCKET_CHECK_TIMEOUT).catch(
    async () => {
      await delay(Constants.WEBSOCKET_CHECK_DELAY);

      if (iterator < Constants.WEBSOCKET_CHECK_LIMIT) {
        return await checkWebSocketRecursively(iterator + 1);
      } else {
        throw new TimeoutError('TimeoutError');
      }
    }
  );
}
