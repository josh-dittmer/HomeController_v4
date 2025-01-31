import { isLeft } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

export const RGBLightsProgram = t.union([
    t.literal('rainbowFade'), t.literal('psychedelicFade'), t.literal('guitarSync'), t.literal('none')
]);

export type RGBLightsProgramT = t.TypeOf<typeof RGBLightsProgram>;

export const RGBLightsState = t.type({
    powered: t.boolean,
    program: RGBLightsProgram,
    r: t.number,
    g: t.number,
    b: t.number
});

export type RGBLightsStateT = t.TypeOf<typeof RGBLightsState>;

export function stateDecode(data: object): RGBLightsStateT {
    const decoded = RGBLightsState.decode(data);
    if (isLeft(decoded)) {
        throw new Error('invalid data provided for RGBLights state decode');
    }

    return decoded.right;
}

export const Commands = {
    powerOn: () => ({
        command: 'powerOn'
    }),
    powerOff: () => ({
        command: 'powerOff'
    }),
    setColor: (r: number, g: number, b: number) => ({
        command: 'setColor',
        data: {
            r: r,
            g: g,
            b: b
        }
    }),
    startProgram: (program: RGBLightsProgramT) => ({
        command: 'startProgram',
        data: {
            program: program
        }
    }),
    interruptProgram: (buf: Buffer) => ({
        command: 'interruptProgram',
        data: {
            buf: buf
        }
    }),
    stopProgram: () => ({
        command: 'stopProgram'
    })
}