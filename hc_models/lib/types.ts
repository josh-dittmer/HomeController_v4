import { Server, Socket as ServerSocket } from "socket.io";
import { Socket as ClientSocket } from "socket.io-client";
import { HCGatewayModels } from "./models.js";

namespace HCEvents {
    type DefaultEventCallback = (data: unknown) => void;
    type DefaultEventWithAckCallback = (data: unknown, cb: DefaultEventCallback) => void;

    namespace User {
        // to user
        export interface ServerToClientEvents {
            stateChangedNotification: (data: HCGatewayModels.User.StateChangedNotifcationDataT) => void;
            deviceConnectedNotification: (data: HCGatewayModels.User.DeviceConnectedNotificationDataT) => void;
            deviceDisconnectedNotification: (data: HCGatewayModels.User.DeviceDisconnectedNotificationDataT) => void;
        };

        // from user
        export interface ClientToServerEvents {
            stateRequest: (data: HCGatewayModels.User.StateRequestDataT, cb: (data: HCGatewayModels.User.StateResponseDataT) => void) => void,
            commandRequest: (data: HCGatewayModels.User.CommandRequestDataT) => void;
        };
    }

    namespace Device {
        // to device
        export interface ServerToClientEvents {
            stateRequest: (data: HCGatewayModels.Device.StateRequestDataT) => void;
            commandRequest: (data: HCGatewayModels.Device.CommandRequestDataT) => void;
            deviceDeletedNotification: (data: HCGatewayModels.Device.DeviceDeletedNotificationDataT) => void;
        };

        // from device
        export interface ClientToServerEvents {
            stateResponse: (data: HCGatewayModels.Device.StateResponseDataT) => void;
            stateChangedNotification: (data: HCGatewayModels.Device.StateChangeNotificationDataT) => void;
        };
    }

    export type ServerToClientEvents = User.ServerToClientEvents & Device.ServerToClientEvents;
    export type ClientToServerEvents = User.ClientToServerEvents & Device.ClientToServerEvents;
    export type InterServerEvents = {};
}

export type SocketData = {
    user: HCGatewayModels.User.SocketDataT,
    device: null,
} | {
    user: null,
    device: HCGatewayModels.Device.SocketDataT
}

export type HCServer = Server<HCEvents.ClientToServerEvents, HCEvents.ServerToClientEvents, HCEvents.InterServerEvents, SocketData>;

export type HCServerSocket = ServerSocket<HCEvents.ClientToServerEvents, HCEvents.ServerToClientEvents, HCEvents.InterServerEvents, SocketData>;
export type HCClientSocket = ClientSocket<HCEvents.ServerToClientEvents, HCEvents.ClientToServerEvents>;