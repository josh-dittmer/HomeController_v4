import { isLeft } from 'fp-ts/lib/Either.js';
import { UUID } from 'io-ts-types';


export function validateUUID(str: string) {
    const decoded = UUID.decode(str);
    if (isLeft(decoded)) {
        throw new Error('bad uuid');
    }

    return decoded.right;
}