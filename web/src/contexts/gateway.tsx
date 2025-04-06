import { Endpoints } from "@/lib/api/endpoints";
import { getTicket } from "@/lib/api/requests";
import { useQueryClient } from "@tanstack/react-query";
import { HCGatewayModels } from "hc_models/models";
import { HCGatewayTypes } from "hc_models/types";
import { cast } from "hc_models/util";
import { UUID } from "io-ts-types";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

type RequestStateFunc = (deviceId: UUID, cb: (data: HCGatewayModels.User.StateResponseDataT) => void) => void;
type SendCommandFunc = (deviceId: UUID, data: unknown) => void;
type CallbackFunc = (data: unknown) => void;
type SubscribeFunc = (channel: string, callback: CallbackFunc) => void;
type UnsubscribeFunc = (channel: string) => void;

export type GatewayContextType = {
    requestState: RequestStateFunc,
    sendCommand: SendCommandFunc,
    subscribe: SubscribeFunc,
    unsubscribe: UnsubscribeFunc,
    connected: boolean
};

export const GatewayContext = createContext<GatewayContextType | null>(null);

export function GatewayProvider({ ticket, children }: { ticket: string, children: ReactNode }) {
    const client = useQueryClient();

    const socketInst = useRef<HCGatewayTypes.User.ClientSocket | null>(null);
    const channels = useRef(new Map<string, CallbackFunc>());

    const [connected, setConnected] = useState<boolean>(false);

    const requestState: RequestStateFunc = async (deviceId: UUID, cb: (data: HCGatewayModels.User.StateResponseDataT) => void) => {
        socketInst?.current?.emit('stateRequest', { deviceId: deviceId }, (data: HCGatewayModels.User.StateResponseDataT) => {
            cb(data);
        });
    };

    const sendCommand: SendCommandFunc = (deviceId: UUID, data: unknown) => {
        socketInst?.current?.emit('commandRequest', {
            deviceId: deviceId,
            data: data
        });
    };

    const subscribe: SubscribeFunc = (channel: string, callback: CallbackFunc) => {
        channels.current.set(channel, callback);
    };

    const unsubscribe: UnsubscribeFunc = (channel: string) => {
        channels.current.delete(channel);
    };

    useEffect(() => {
        socketInst.current = io(`${Endpoints.mainApiPublicUrl}/user`, {
            path: `${Endpoints.mainApiPrefix}/gateway`,
            auth: async (cb) => {
                const res = await getTicket();

                cb({
                    ticket: res.ticket,
                })
            }
        });

        socketInst.current.on('connect_error', (err) => {
            console.log(`GATEWAY CONNECTION ERROR: ${err}`);
            socketInst.current?.disconnect();
        });

        socketInst.current.on('connect', () => {
            setConnected(true);
        });

        socketInst.current.on('stateChangedNotification', (data: HCGatewayModels.User.StateChangedNotifcationDataT) => {
            const notification = cast(HCGatewayModels.User.StateChangedNotifcationData)(data);

            const cb = channels.current.get(notification.deviceId);

            if (cb) {
                cb(notification.data);
            }
        });

        socketInst.current.on('deviceConnectedNotification', (data: HCGatewayModels.User.DeviceConnectedNotificationDataT) => {
            //client.invalidateQueries({ queryKey: allDevicesKey() });
            //client.invalidateQueries({ queryKey: oneDeviceKey(msg.deviceId) });
            console.log(`[device/${data.deviceId}] connected`);
        });

        socketInst.current.on('deviceDisconnectedNotification', (data: HCGatewayModels.User.DeviceDisconnectedNotificationDataT) => {
            //client.invalidateQueries({ queryKey: allDevicesKey() });
            //client.invalidateQueries({ queryKey: oneDeviceKey(msg.deviceId) });
            console.log(`[device/${data.deviceId}] disconnected`);
        });

        return () => {
            socketInst.current?.disconnect();
        }
    }, [client, ticket]);

    return (
        <GatewayContext.Provider
            value={{
                requestState: requestState,
                sendCommand: sendCommand,
                subscribe: subscribe,
                unsubscribe: unsubscribe,
                connected: connected
            }}
        >
            {children}
        </GatewayContext.Provider>
    )
}