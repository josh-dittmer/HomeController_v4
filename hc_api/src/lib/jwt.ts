import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PUBLIC_KEY_PATH } from './common/values.js';

const publicKey = fs.readFileSync(PUBLIC_KEY_PATH);

interface JothJwtPayload extends JwtPayload {
    scope: string;
    email: string;
}

export function verifyJothJwt(token: string): JothJwtPayload {
    const data = <JothJwtPayload>jwt.verify(token, publicKey, { algorithms: ['RS256'] });

    if (!data.sub || !data.scope || !data.email) {
        throw new Error('malformed jwt');
    }

    if (data.scope !== 'app_access') {
        throw new Error('bad scope');
    }

    return data;
}
