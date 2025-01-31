'use client';

import { useOneDeviceQuery } from "@/lib/queries/one_device";
import { GetOneDeviceResponseT } from "hc_models/models";
import { WifiOff } from "lucide-react";
import Header from "./header/header";
import RGBLightsControlPanel from "./rgb_lights/control_panel";

function OfflineDisplay() {
    return (
        <>
            <div className="h-[calc(100%-2.5rem)] flex items-center justify-center">
                <WifiOff width={50} height={50} className="text-fg-medium mb-10" />
            </div>
        </>
    )
}

export default function ControlPanel({ res }: { res: GetOneDeviceResponseT }) {
    const { data } = useOneDeviceQuery(res);

    return (
        <div className="p-4 w-full h-full">
            <Header device={data.device} />
            {data.online ? (
                res.device.type === 'rgb_lights' ? (
                    <RGBLightsControlPanel device={data.device} />
                ) : (
                    <p>Unknown device type</p>
                )
            ) : (
                <OfflineDisplay />
            )}
        </div>
    )
}