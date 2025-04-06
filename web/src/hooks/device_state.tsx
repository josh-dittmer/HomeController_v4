import { GatewayContext } from "@/contexts/gateway";
import { HCGatewayModels } from "hc_models/models";
import { cast } from "hc_models/util";
import { UUID } from "io-ts-types";
import { useContext, useEffect, useState } from "react";

export function useDeviceState<T>(deviceId: string, decode: (data: unknown) => T, debugDelay?: boolean) {
    const [state, setState] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const gatewayCtx = useContext(GatewayContext);

    useEffect(() => {
        if (gatewayCtx && gatewayCtx.connected) {
            gatewayCtx.subscribe(deviceId, (data: unknown) => {
                try {
                    setState(decode(data));
                } catch {
                    setState(null);
                }
            });

            gatewayCtx.requestState(cast(UUID)(deviceId), async (data: HCGatewayModels.User.StateResponseDataT) => {
                try {
                    if (debugDelay)
                        await new Promise((resolve) => setTimeout(resolve, 3000));

                    setState(
                        data.state !== null
                            ? decode(data.state)
                            : null
                    );
                } finally {
                    setLoading(false);
                }
            });

            return () => {
                gatewayCtx.unsubscribe(deviceId);
            }
        }
    }, [gatewayCtx, gatewayCtx?.connected, deviceId, decode, debugDelay]);

    return { state, loading, ctx: gatewayCtx };
}