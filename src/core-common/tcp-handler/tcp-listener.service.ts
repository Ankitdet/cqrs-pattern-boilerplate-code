import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as net from "net";
import { TcpMessageHandler } from "./tcp-handler.interface";
import { Result } from "../result-model/result";
import { GenericError } from "../error/generic.error";

@Injectable()
export class TcpListenerService<T> implements OnModuleInit, OnModuleDestroy {
  private server: net.Server;

  constructor(
    private readonly port: number,
    private readonly host: string,
    private readonly handler: TcpMessageHandler<T>
  ) {}

  onModuleInit() {
    this.server = net.createServer((socket) => {
      const ip = socket.remoteAddress;
      const port = socket.remotePort;
      console.log(`📡 Connected: ${ip}:${port}`);
      socket.on("data", (data: Buffer) => {
        try {
          const message = this.handler.parse(data, socket);
          this.handler.handle(message, socket);
        } catch (err) {
          console.error("❌ TCP processing error:", err.message);
          return Result.failed(
            new GenericError("TCP processing error", err.message)
          );
        }
      });

      socket.on("close", () => {
        console.log(`❌ Disconnected: ${ip}:${port}`);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", JSON.stringify(err.stack));
        return Result.failed(new GenericError("Socket error", err.message));
      });
    });

    this.server.listen(this.port, this.host, () => {
      console.log(`🚀 TCP listening on ${this.host}:${this.port}`);
    });
  }

  onModuleDestroy() {
    this.server?.close();
    console.log("🛑 TCP server closed");
  }
}
