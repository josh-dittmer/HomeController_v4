import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { TicketResponseT } from 'hc_models/models';
import { RepoService } from '../../repo/services/repo.service.js';

@Controller('ticket')
export class TicketController {
    private readonly logger = new Logger('TicketController');

    constructor(private readonly hc: RepoService) { }

    @Get()
    async get(@Req() req: Request, @Res() res: Response) {
        const ticket = await this.hc.ticketRepository.create(res.locals.userId);

        const response: TicketResponseT = {
            ticket: ticket,
        };

        res.json(response);
    }
}
