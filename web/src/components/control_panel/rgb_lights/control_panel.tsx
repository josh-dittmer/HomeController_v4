'use client';

import { useDeviceState } from "@/hooks/device_state";
import { stateDecode } from "@/lib/api/device_data/rgb_lights";
import { DeviceT } from "hc_models/models";
import ColorButton from "./color_button";
import ColorPicker from "./color_picker";
import ColorPreview from "./color_preview";
import PowerButton from "./power_button";
import ProgramButton from "./program_button";

export default function RGBLightsControlPanel({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;

    return (
        <div className="h-[calc(100vh-152px)] pt-4">
            {ready ? (
                <ColorPreview r={state.r} g={state.g} b={state.b} />
            ) : (
                <ColorPreview r={0} b={0} g={0} />
            )}
            <div className="grid w-full h-full lg:grid-cols-[1fr_1fr_1fr] mt-4 pb-4">
                <div className="p-2">
                    <div className="bg-bg-medium rounded-xl flex justify-center items-center w-full h-full">
                        <PowerButton enabled={ready} ctx={ctx} deviceId={device.deviceId} powered={state?.powered} width={75} height={75} />
                    </div>
                </div>
                <div className="p-2">
                    <div className="bg-bg-medium rounded-xl flex justify-center items-center w-full h-full">
                        {ready && (
                            <ColorPicker ctx={ctx} deviceId={device.deviceId} r={state.r} g={state.g} b={state.b} />
                        )}
                    </div>
                </div>
                <div className="p-2">
                    <div className="bg-bg-medium rounded-xl flex justify-center items-center w-full h-full">
                        <div className="grid gap-4 grid-rows-[1fr_1fr_1fr] grid-cols-[1fr_1fr_1fr]">
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={0} b={0} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={0} g={255} b={0} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={0} g={0} b={255} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={255} b={0} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={0} g={255} b={255} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={0} b={255} cn="p-3" />
                            <ProgramButton enabled={ready} ctx={ctx} deviceId={device.deviceId} program={'rainbowFade'} selectedProgram={state?.program} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={255} b={255} cn="p-3" />
                            <ColorButton enabled={ready} ctx={ctx} deviceId={device.deviceId} r={255} g={255} b={255} cn="p-3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};