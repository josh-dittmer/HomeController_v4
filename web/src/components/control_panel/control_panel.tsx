'use client';

import { useOneDeviceQuery } from "@/lib/queries/one_device";
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

export default function ControlPanel({ deviceId }: { deviceId: string }) {
    const { data, isLoading } = useOneDeviceQuery(deviceId);

    if (!data || isLoading) {
        return <p>CONTROL LOADING...</p>
    }

    return (
        <div className="p-4 w-full h-full">
            <Header device={data.device} />
            {data.online ? (
                data.device.type === 'rgb_lights' ? (
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