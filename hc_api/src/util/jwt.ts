import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = fs.readFileSync('./keys/private.key');

interface JothJwtPayload extends JwtPayload {
    scope: string;
    email: string;
};

export function verifyJothJwt(token: string): JothJwtPayload {
    const data = <JothJwtPayload>jwt.verify(token, secret);

    if (!data.sub || !data.scope || !data.email) {
        throw new Error('malformed jwt');
    }

    if (data.scope !== 'app_access') {
        throw new Error('bad scope');
    }

    return data;
};
