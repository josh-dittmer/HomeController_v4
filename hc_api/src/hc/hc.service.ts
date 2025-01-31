import { Injectable } from "@nestjs/common";
import { DeviceRepository } from "../app/repositories/device.repository.js";
import { TicketRepository } from "../app/repositories/ticket.repository.js";
import { UserRepository } from "../app/repositories/user.repository.js";

@Injectable()
export class HCService {
    deviceRepository: DeviceRepository;
    ticketRepository: TicketRepository;
    userRepository: UserRepository;

    constructor(deviceRepository: DeviceRepository, ticketRepository: TicketRepository, userRepository: UserRepository) {
        this.deviceRepository = deviceRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    static register() {
        return {
            provide: HCService,
            useFactory: () => {
                const deviceRepository = new DeviceRepository();
                const ticketRepository = new TicketRepository();
                const userRepository = new UserRepository();

                return new HCService(deviceRepository, ticketRepository, userRepository);
            }
        }
    }
}