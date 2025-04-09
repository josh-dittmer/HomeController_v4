import * as t from 'io-ts';
import { UUID } from 'io-ts-types';
import { DeviceType } from './values.js';

// for the WebSocket API

export namespace HCGatewayModels {
    export namespace User {
        export const Auth = t.type({
            ticket: t.string
        });

        export type AuthT = t.TypeOf<typeof Auth>;

        export type SocketDataT = {
            id: UUID,
            queues: Map<UUID, Array<(state: unknown) => void>>
        }

        // sent to users
        export const StateResponseData = t.type({
            state: t.union([
                t.null, t.unknown
            ])
        });

        export type StateResponseDataT = t.TypeOf<typeof StateResponseData>;

        export const DeviceConnectedNotificationData = t.type({
            deviceId: UUID
        });

        export type DeviceConnectedNotificationDataT = t.TypeOf<typeof DeviceConnectedNotificationData>;

        export const DeviceDisconnectedNotificationData = t.type({
            deviceId: UUID
        });

        export type DeviceDisconnectedNotificationDataT = t.TypeOf<typeof DeviceDisconnectedNotificationData>;


        export const StateChangedNotifcationData = t.type({
            deviceId: UUID,
            data: t.unknown
        });

        export type StateChangedNotifcationDataT = t.TypeOf<typeof StateChangedNotifcationData>;

        // sent from users
        export const StateRequestData = t.type({
            deviceId: UUID
        });

        export type StateRequestDataT = t.TypeOf<typeof StateRequestData>;

        export const CommandRequestData = t.type({
            deviceId: UUID,
            data: t.unknown
        })

        export type CommandRequestDataT = t.TypeOf<typeof CommandRequestData>;
    }

    export namespace Device {
        export const Auth = t.type({
            id: UUID,
            secret: t.string
        });

        export type AuthT = t.TypeOf<typeof Auth>;

        export type SocketDataT = {
            id: UUID,
            owner: UUID
        }

        // sent to devices
        export const StateRequestData = t.type({
            socketId: t.string
        });

        export type StateRequestDataT = t.TypeOf<typeof StateRequestData>;

        export const CommandRequestData = t.type({
            data: t.unknown
        });

        export type CommandRequestDataT = t.TypeOf<typeof CommandRequestData>;

        export const DeviceDeletedNotificationData = t.type({});

        export type DeviceDeletedNotificationDataT = t.TypeOf<typeof DeviceDeletedNotificationData>;

        // sent from devices
        export const StateResponseData = t.type({
            socketId: t.string,
            data: t.unknown
        });

        export type StateResponseDataT = t.TypeOf<typeof StateResponseData>;

        export const StateChangeNotificationData = t.type({
            data: t.unknown
        });

        export type StateChangeNotificationDataT = t.TypeOf<typeof StateChangeNotificationData>;
    }
}


// for the HTTP API

export const User = t.type({
    userId: UUID,
    name: t.string
})

export type UserT = t.TypeOf<typeof User>;

export const UserArray = t.array(User);
export type UserArrayT = t.TypeOf<typeof UserArray>;

export const Device = t.type({
    deviceId: UUID,
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
    deviceId: UUID,
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

