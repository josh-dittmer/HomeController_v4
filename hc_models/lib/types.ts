import { Server as GenericServer, Socket as GenericServerSocket } from "socket.io";
import { Socket as GenericClientSocket } from "socket.io-client";
import { HCGatewayModels } from "./models.js";

export namespace HCGatewayTypes {
    export type InterServerEvents = {};

    export namespace User {
        // to user
        interface ServerToClientEvents {
            stateChangedNotification: (data: HCGatewayModels.User.StateChangedNotifcationDataT) => void;
            deviceConnectedNotification: (data: HCGatewayModels.User.DeviceConnectedNotificationDataT) => void;
            deviceDisconnectedNotification: (data: HCGatewayModels.User.DeviceDisconnectedNotificationDataT) => void;
        };

        // from user
        interface ClientToServerEvents {
            stateRequest: (data: HCGatewayModels.User.StateRequestDataT, cb: (data: HCGatewayModels.User.StateResponseDataT) => void) => void,
            commandRequest: (data: HCGatewayModels.User.CommandRequestDataT) => void;
        };

        export type SocketData = {
            user: HCGatewayModels.User.SocketDataT
        };

        export type Server = GenericServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
        export type ServerSocket = GenericServerSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

        export type ClientSocket = GenericClientSocket<ServerToClientEvents, ClientToServerEvents>;
    }

    export namespace Device {
        // to device
        interface ServerToClientEvents {
            stateRequest: (data: HCGatewayModels.Device.StateRequestDataT) => void;
            commandRequest: (data: HCGatewayModels.Device.CommandRequestDataT) => void;
            deviceDeletedNotification: (data: HCGatewayModels.Device.DeviceDeletedNotificationDataT) => void;
        };

        // from device
        interface ClientToServerEvents {
            stateResponse: (data: HCGatewayModels.Device.StateResponseDataT) => void;
            stateChangedNotification: (data: HCGatewayModels.Device.StateChangeNotificationDataT) => void;
        };

        export type SocketData = {
            device: HCGatewayModels.Device.SocketDataT
        };

        export type Server = GenericServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
        export type ServerSocket = GenericServerSocket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
    }

    //export type ServerToClientEvents = User.ServerToClientEvents & Device.ServerToClientEvents;
    //export type ClientToServerEvents = User.ClientToServerEvents & Device.ClientToServerEvents;
}

/*export type UserSocketData = {
    user: HCGatewayModels.User.SocketDataT
};

export type DeviceSocketData = {
    device: HCGatewayModels.Device.SocketDataT
};*/

/*export type SocketData = {
    user: HCGatewayModels.User.SocketDataT,
    device: null,
} | {
    user: null,
    device: HCGatewayModels.Device.SocketDataT
}*/

//export type HCUserServer = Server<HCEvents.User.ClientToServerEvents, HCEvents.User.ServerToClientEvents, HCEvents.InterServerEvents, UserSocketData>;
//export type HCDeviceServer = Server<HCEvents.Device.ClientToServerEvents, HCEvents.Device.ServerToClientEvents, HCEvents.InterServerEvents, DeviceSocketData>;

//export type HCUserServerSocket = ServerSocket<HCEvents.User.ClientToServerEvents, HCEvents.User.ServerToClientEvents, HCEvents.InterServerEvents, UserSocketData>;
//export type HCDeviceServerSocket = ServerSocket<HCEvents.Device.ClientToServerEvents, HCEvents.Device.ServerToClientEvents, HCEvents.InterServerEvents, DeviceSocketData>;

//export type HCUserClientSocket = ClientSocket<HCEvents.User.ServerToClientEvents, HCEvents.User.ClientToServerEvents>;