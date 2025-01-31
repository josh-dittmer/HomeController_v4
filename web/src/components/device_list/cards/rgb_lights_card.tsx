'use client';

import ColorButton from "@/components/control_panel/rgb_lights/color_button";
import PowerButton from "@/components/control_panel/rgb_lights/power_button";
import ProgramButton from "@/components/control_panel/rgb_lights/program_button";
import { useDeviceState } from "@/hooks/device_state";
import { stateDecode } from "@/lib/api/device_data/rgb_lights";
import { DeviceT } from "hc_models/models";
import { motion } from "motion/react";
import Link from "next/link";

export function RGBLightsCard({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;

    return (
        <div
            className="bg-bg-dark rounded w-64"
            style={{ boxShadow: ready ? (`0 0 30px 1px rgb(${state.r}, ${state.g}, ${state.b})`) : `` }}
        >
            <div className="h-20">
                <div className="p-2 h-full grid grid-cols-[1fr_3fr] items-center">
                    <div className="flex justify-center">
                        <PowerButton enabled={ready} deviceId={device.deviceId} powered={state?.powered} width={30} height={30} ctx={ctx} />
                    </div>
                    <div className="h-full flex flex-col justify-center gap-2">
                        <div className="flex justify-center">
                            <Link href={`/home/device/${device.deviceId}`} prefetch={true}>
                                <h1 className={ready ? `text-fg-dark` : `text-fg-light`}>{device.name}</h1>
                            </Link>
                        </div>
                        <div className="flex justify-center">
                            <div className="flex gap-3 justify-center items-center">
                                <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={255} b={255} cn="p-2" />
                                <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={0} b={0} cn="p-2" />
                                <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={0} b={255} cn="p-2" />
                                <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={0} g={255} b={255} cn="p-2" />
                                <ProgramButton enabled={ready} ctx={ctx} deviceId={device.deviceId} program={'rainbowFade'} selectedProgram={state?.program} cn="p-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-9 p-3 bg-bg-medium flex justify-center items-center rounded-b">
                {state && !loading && (
                    <motion.p
                        className="text-xs text-fg-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        ONLINE, POWERED {state.powered ? 'ON' : 'OFF'}
                    </motion.p>
                )}
            </div>
        </div>
    )
}