import { useDeviceState } from "@/hooks/device_state";
import { stateDecode } from "@/lib/api/device_data/plug";
import { DeviceT } from "hc_models/models";
import PowerButton from "./power_button";

export default function PlugControlPanel({ device }: { device: DeviceT }) {
    const { loading, state, ctx } = useDeviceState(device.deviceId, stateDecode);

    if (!loading && !state) {
        return (
            <p>Something went wrong!</p>
        )
    }

    const ready = state && !loading;

    return (
        <div className="h-[calc(100svh-152px)] pt-4">
            <div className="grid w-full h-full lg:grid-cols-[1fr]">
                <div className="p-2">
                    <div className="bg-bg-medium rounded-xl flex justify-center items-center w-full h-full">
                        <PowerButton enabled={ready} ctx={ctx} deviceId={device.deviceId} state={state} width={75} height={75} />
                    </div>
                </div>
            </div>
        </div>
    )
};