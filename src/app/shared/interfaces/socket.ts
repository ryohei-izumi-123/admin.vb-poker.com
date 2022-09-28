import { SocketOptions, ManagerOptions } from 'socket.io-client';
type SocketClientOptions = Partial<ManagerOptions & SocketOptions>;
export interface ISocketOptions extends SocketClientOptions {
  [key: string]: any;
}
