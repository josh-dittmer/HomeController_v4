import { GatewayContext } from "@/contexts/gateway";
import { useContext, useEffect, useState } from "react";

export function useDeviceState<T>(deviceId: string, decoder: (data: object) => T, debugDelay?: boolean) {
    const [state, setState] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const gatewayCtx = useContext(GatewayContext);

    useEffect(() => {
        if (gatewayCtx && gatewayCtx.connected) {
            gatewayCtx.subscribe(deviceId, (data: object) => {
                try {
                    setState(decoder(data));
                } catch {
                    setState(null);
                }
            });

            gatewayCtx.requestState(deviceId, async (data: object | null) => {
                try {
                    if (debugDelay)
                        await new Promise((resolve) => setTimeout(resolve, 3000));

                    setState(data ? decoder(data) : null);
                } finally {
                    setLoading(false);
                }
            });

            return () => {
                gatewayCtx.unsubscribe(deviceId);
            }
        }
    }, [gatewayCtx, gatewayCtx?.connected, deviceId, decoder, debugDelay]);

    return { state, loading, ctx: gatewayCtx };
}