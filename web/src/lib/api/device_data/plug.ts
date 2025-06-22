import { cast } from 'hc_models/util';
import * as t from 'io-ts';

export const PlugPowerState = t.union([
    t.literal('on'), t.literal('off'), t.literal('onLocked'), t.literal('offLocked')
]);

export type PlugPowerStateT = t.TypeOf<typeof PlugPowerState>;

export const PlugState = t.type({
    powerState: PlugPowerState,
    lockDuration: t.number
});

export type PlugStateT = t.TypeOf<typeof PlugState>;

export function stateDecode(data: unknown): PlugStateT {
    console.log(data);
    return cast(PlugState)(data);
}

export const Commands = {
    powerOn: () => ({
        command: 'powerOn'
    }),
    powerOff: () => ({
        command: 'powerOff'
    })
}