import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface connectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    };
}


@Injectable()
export class MessagesWsService {

    private connectedClient: connectedClients = {}

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async registerClient( client: Socket, userId: string) {

        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is inactive');

        this.checkUserConnection(user);
        
        this.connectedClient[client.id] = {
            socket: client,
            user
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClient[clientId];
    }

    getConectedClients(): string[] {
        return Object.keys(this.connectedClient)
    }

    getUserFullName(sockerId: string) {
        return this.connectedClient[sockerId].user.fullName;
    }

    private checkUserConnection(user: User) {
        for (const clientId of Object.keys(this.connectedClient)) {
            const connectedClient = this.connectedClient[clientId];

            if(connectedClient.user.id === user.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }
}
