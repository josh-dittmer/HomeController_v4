import { Injectable } from '@nestjs/common';
import { DBService } from '../../db/services/db.service.js';
import { DeviceRepository } from '../repositories/device.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { UserRepository } from '../repositories/user.repository.js';

@Injectable()
export class RepoService {
    deviceRepository: DeviceRepository;
    ticketRepository: TicketRepository;
    userRepository: UserRepository;

    constructor(
        deviceRepository: DeviceRepository,
        ticketRepository: TicketRepository,
        userRepository: UserRepository,
    ) {
        this.deviceRepository = deviceRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    static register() {
        return {
            provide: RepoService,
            useFactory: (db: DBService) => {
                const deviceRepository = new DeviceRepository(db);
                const ticketRepository = new TicketRepository(db);
                const userRepository = new UserRepository(db);

                return new RepoService(deviceRepository, ticketRepository, userRepository);
            },
            inject: [DBService]
        };
    }
}
