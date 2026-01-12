// tcp-handler.interface.ts
import * as net from "net";

export interface TcpMessageHandler<T> {
  parse(data: Buffer, socket: net.Socket): T;
  handle(message: T, socket: net.Socket): void;
}
