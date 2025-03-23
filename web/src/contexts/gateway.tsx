import { Endpoints } from "@/lib/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { ClientToServerEvents, ServerToClientEvents, UserCheckStateReplyData, UserDeviceConnectedData, UserDeviceDisconnectedData, UserStateChangedData } from "hc_models/types";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type RequestStateFunc = (deviceId: string, cb: (data: object | null) => void) => void;
type SendCommandFunc = (deviceId: string, data: object) => void;
type CallbackFunc = (data: object) => void;
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

    const socketInst = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const channels = useRef(new Map<string, CallbackFunc>());

    const [connected, setConnected] = useState<boolean>(false);

    const requestState: RequestStateFunc = async (deviceId: string, cb: (data: object | null) => void) => {
        socketInst?.current?.emit('userCheckStateRequest', { deviceId: deviceId, }, (msg: UserCheckStateReplyData) => {
            cb(msg.data);
        });
    };

    const sendCommand: SendCommandFunc = (deviceId: string, data: object) => {
        socketInst?.current?.emit('userCommand', {
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
        socketInst.current = io(Endpoints.mainApiPublicUrl, {
            path: `${Endpoints.mainApiPrefix}/gateway`,
            auth: async (cb) => {
                cb({
                    type: 'user',
                    key: ticket
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

        socketInst.current.on('userStateChanged', (msg: UserStateChangedData) => {
            const cb = channels.current.get(msg.deviceId);

            if (cb) {
                cb(msg.data);
            }
        });

        socketInst.current.on('userDeviceConnected', (msg: UserDeviceConnectedData) => {
            //client.invalidateQueries({ queryKey: allDevicesKey() });
            //client.invalidateQueries({ queryKey: oneDeviceKey(msg.deviceId) });
        });

        socketInst.current.on('userDeviceDisconnected', (msg: UserDeviceDisconnectedData) => {
            //client.invalidateQueries({ queryKey: allDevicesKey() });
            //client.invalidateQueries({ queryKey: oneDeviceKey(msg.deviceId) });
        });

        return () => {
            socketInst.current?.disconnect();
        }
    }, [client]);

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