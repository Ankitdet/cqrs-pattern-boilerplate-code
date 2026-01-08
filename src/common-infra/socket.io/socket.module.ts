import { DynamicModule, Module } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { BaseSocketGateway } from './socket.gateway';
import { SocketModuleOptions } from './socket.options';

@Module({})
export class SocketModule {
    static register(options: SocketModuleOptions = {}): DynamicModule {
        @WebSocketGateway({
            cors: options.cors ?? { origin: '*' },
            namespace: options.namespace,
        })
        class Gateway extends BaseSocketGateway {}
        return {
            module: SocketModule,
            providers: [Gateway],
            exports: [Gateway],
        };
    }
}
