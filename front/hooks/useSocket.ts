import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:8000';
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (
  workspace: string
): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace && sockets[workspace]) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], //http안보내고 websocket만 연결
    });
  }

  //emit으로 보내고 on으로 받고

  //   sockets[workspace].on('connect', console.log);
  //   sockets[workspace].on('message', console.log);
  //   sockets[workspace].on('disconnect', () => {
  //     console.log('disconnect');
  //   });
  console.info('create socket', workspace, sockets[workspace]);

  return [sockets[workspace], disconnect];
};
export default useSocket;
