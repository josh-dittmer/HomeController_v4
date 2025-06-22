import PowerButton from "@/components/control_panel/plug/power_button";
import { useDeviceState } from "@/hooks/device_state";
import { stateDecode } from "@/lib/api/device_data/plug";
import { DeviceT } from "hc_models/models";
import { motion } from "motion/react";
import Link from "next/link";

export function PlugCard({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;
    const powered = state?.powerState === 'on' || state?.powerState === 'onLocked';

    return (
        <div
            className="bg-bg-dark rounded w-64"
        //style={{ boxShadow: ready ? (`0 0 30px 1px rgb(${state.r}, ${state.g}, ${state.b})`) : `` }}
        >
            <div className="h-20">
                <div className="p-2 h-full grid grid-cols-[1fr_3fr] items-center">
                    <div className="flex justify-center">
                        <PowerButton
                            enabled={ready}
                            deviceId={device.deviceId}
                            state={state}
                            width={30}
                            height={30}
                            ctx={ctx}
                        />
                    </div>
                    <div className="h-full flex flex-col justify-center gap-2">
                        <div className="flex justify-center">
                            <Link href={`/home/device/${device.deviceId}`} prefetch={true}>
                                <h1 className={ready ? `text-fg-dark` : `text-fg-light`}>{device.name}</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-9 p-3 bg-bg-medium flex justify-center items-center rounded-b">
                {ready && (
                    <motion.p
                        className="text-xs text-fg-medium"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        ONLINE, POWERED {powered ? 'ON' : 'OFF'}
                    </motion.p>
                )}
            </div>
        </div>
    );
}