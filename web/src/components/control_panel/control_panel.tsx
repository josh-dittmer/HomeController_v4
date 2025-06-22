'use client';

import { GetOneDeviceResponseT } from "hc_models/models";
import { WifiOff } from "lucide-react";
import Header from "./header/header";
import PlugControlPanel from "./plug/control_panel";
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
    return (
        <div className="p-4 w-full h-full">
            <Header device={res.device} />
            {res.online ? (
                res.device.type === 'rgb_lights' ? (
                    <RGBLightsControlPanel device={res.device} />
                ) : res.device.type === 'plug' ? (
                    <PlugControlPanel device={res.device} />
                ) : (
                    <p>Unknown device type</p>
                )
            ) : (
                <OfflineDisplay />
            )}
        </div>
    )
}