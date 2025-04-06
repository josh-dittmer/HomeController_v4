import { isLeft } from 'fp-ts/lib/Either.js';
import t from 'io-ts';

export function cast<I, A>(codec: t.Decoder<I, A>): (value: I) => A {
    return (value: I) => {
        const decoded = codec.decode(value);
        if (isLeft(decoded)) {
            throw new Error('failed to decode');
        }

        return decoded.right;
    }
}