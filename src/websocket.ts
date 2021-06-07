import * as Constants from './constants';
import { TimeoutError, WebSocketError } from './errors';
import { delay } from './utils';

/**
 *
 */
export async function checkWebSocket(): Promise<void> {
  return await new Promise<void>((resolve, reject) => {
    let socket = new WebSocket(Constants.WEBSOCKET_BRIDGE_URL);
    let isSuccess = false;

    setTimeout(() => {
      socket.close();
    }, Constants.WEBSOCKET_CHECK_TIMEOUT);

    socket.onopen = () => {
      isSuccess = true;

      socket.close();
    };

    socket.onclose = () => {
      if (isSuccess) {
        resolve();
      } else {
        reject(new WebSocketError());
      }
    };

    socket.onerror = () => {
      reject(new WebSocketError());
    };
  });
}

/**
 *
 * @param iterator
 */
export async function checkWebSocketRecursively(iterator = 0): Promise<void> {
  return await checkWebSocket().catch(async () => {
    await delay(Constants.WEBSOCKET_CHECK_DELAY);

    if (iterator < Constants.WEBSOCKET_CHECK_LIMIT) {
      return await checkWebSocketRecursively(iterator + 1);
    } else {
      throw new TimeoutError();
    }
  });
}
