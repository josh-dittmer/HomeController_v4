import { Response } from "express";

export function unauthorized(res: Response) {
    res.status(401).send({
        message: 'client is unauthorized'
    });
}

export function notFound(res: Response, what: string) {
    res.status(404).send({
        message: `${what} not found`,
    });
}

export function badRequest(res: Response) {
    res.status(400).send({
        message: 'invalid request body',
    });
}
