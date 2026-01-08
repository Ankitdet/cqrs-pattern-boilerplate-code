import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class BaseSocketGateway {
    @WebSocketServer()
    protected server: Server;

    handleConnection(client: Socket) {
        console.log('[Socket Connected]', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('[Socket Disconnected]', client.id);
    }

    @SubscribeMessage('message')
    onMessage(
        @MessageBody() payload: any,
        @ConnectedSocket() client: Socket,
    ) {
        client.emit('messageResponse', payload);
    }

    protected emitToClient(
        client: Socket,
        event: string,
        data: any,
    ) {
        client.emit(event, data);
    }

    protected broadcast(
        event: string,
        data: any,
    ) {
        this.server.emit(event, data);
    }
}
