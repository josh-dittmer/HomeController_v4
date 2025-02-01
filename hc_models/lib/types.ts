import { ClientTypeT } from "./values";

// sent to users
export type UserCheckStateReplyData = {
    data: object | null
}

export type UserStateChangedData = {
    deviceId: string,
    data: object
};

export type UserDeviceConnectedData = {
    deviceId: string
};

export type UserDeviceDisconnectedData = {
    deviceId: string
};

// sent to devices
export type DeviceCheckStateRequestData = {
    socketId: string
};

export type DeviceCommandData = {
    data: object
};

// sent from users
export type UserCheckStateRequestData = {
    deviceId: string
}

export type UserCommandData = {
    deviceId: string,
    data: object
}

// sent from devices
export type DeviceCheckStateReplyData = {
    socketId: string,
    data: object
}

export type DeviceStateChangedData = {
    data: object
};

export interface ServerToClientEvents {
    // sent to users
    userStateChanged: (msg: UserStateChangedData) => void;
    userDeviceConnected: (msg: UserDeviceConnectedData) => void;
    userDeviceDisconnected: (msg: UserDeviceDisconnectedData) => void;

    // sent to devices
    deviceCheckStateRequest: (msg: DeviceCheckStateRequestData) => void;
    deviceCommand: (msg: DeviceCommandData) => void;
    deviceDeleted: () => void;
}

export interface ClientToServerEvents {
    // sent from users
    userCheckStateRequest: (msg: UserCheckStateRequestData, cb: (msg: UserCheckStateReplyData) => void) => void;
    userCommand: (msg: UserCommandData) => void;

    // sent from devices
    deviceCheckStateReply: (msg: DeviceCheckStateReplyData) => void;
    deviceStateChanged: (msg: DeviceStateChangedData) => void;
}

export interface InterServerEvents {

}

export interface SocketData {
    type: ClientTypeT,
    userId?: string,
    deviceId?: string,
    ownerId?: string,
    checkStateCallbackQueue?: Array<(reply: object) => void>
}