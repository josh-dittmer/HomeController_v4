import * as t from 'io-ts';
import { DeviceType } from './values';

//export * from './values';

export const User = t.type({
    userId: t.string,
    name: t.string
})

export type UserT = t.TypeOf<typeof User>;

export const UserArray = t.array(User);
export type UserArrayT = t.TypeOf<typeof UserArray>;

export const Device = t.type({
    deviceId: t.string,
    type: t.string,
    name: t.string,
    description: t.string
});

export type DeviceT = t.TypeOf<typeof Device>;

export const DeviceArray = t.array(Device);
export type DeviceArrayT = t.TypeOf<typeof DeviceArray>;

export const GetAllDevicesResponse = t.type({
    onlineDevices: DeviceArray,
    offlineDevices: DeviceArray
});

export type GetAllDevicesResponseT = t.TypeOf<typeof GetAllDevicesResponse>;

export const GetOneDeviceResponse = t.type({
    device: Device,
    online: t.boolean
});

export type GetOneDeviceResponseT = t.TypeOf<typeof GetOneDeviceResponse>;

export const TicketResponse = t.type({
    ticket: t.string
});

export type TicketResponseT = t.TypeOf<typeof TicketResponse>;

export const EditDeviceRequest = t.type({
    name: t.string,
    description: t.string
});

export type EditDeviceRequestT = t.TypeOf<typeof EditDeviceRequest>;

export const CreateDeviceRequest = t.type({
    type: DeviceType,
    name: t.string,
    description: t.string
});

export type CreateDeviceRequestT = t.TypeOf<typeof CreateDeviceRequest>;

export const CreateDeviceResponse = t.type({
    deviceId: t.string,
    secret: t.string
});

export type CreateDeviceResponseT = t.TypeOf<typeof CreateDeviceResponse>;

export const GetMyProfileResponse = t.type({
    user: t.union([User, t.null]),
    email: t.string
})

export type GetMyProfileResponseT = t.TypeOf<typeof GetMyProfileResponse>;

export const CreateUserRequest = t.type({
    name: t.string
});

export type CreateUserRequestT = t.TypeOf<typeof CreateUserRequest>;

export const EditUserRequest = t.type({
    name: t.string
});

export type EditUserRequestT = t.TypeOf<typeof CreateUserRequest>;

