import * as t from 'io-ts';

// string length limits
export const MaxUserNameLength = 63;

export const MaxDeviceNameLength = 63;
export const MaxDeviceDescriptionLength = 255;

export const DeviceSecretNumBytes = 255;
export const TicketNumBytes = 255;

// device types
export const DeviceType = t.union([
    t.literal('rgb_lights'),
    t.literal('test_device')
]);

export type DeviceTypeT = t.TypeOf<typeof DeviceType>;

// client types
export const ClientType = t.union([
    t.literal('device'),
    t.literal('user')
]);

export type ClientTypeT = t.TypeOf<typeof ClientType>;
