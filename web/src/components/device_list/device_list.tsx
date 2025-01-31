'use client';

import { useAllDevicesQuery } from "@/lib/queries/all_devices";
import { DeviceT, GetAllDevicesResponseT } from "hc_models/models";
import { OfflineDeviceCard } from "./cards/offline_card";
import { RGBLightsCard } from "./cards/rgb_lights_card";

export default function DeviceList({ res }: { res: GetAllDevicesResponseT }) {
    const { data } = useAllDevicesQuery(res);

    const hasOnlineDevice = data.onlineDevices.length > 0;
    const hasOfflineDevice = data.offlineDevices.length > 0;

    return (
        <div className="p-4 overflow-y-scroll h-[calc(100vh-80px)]">
            {!hasOnlineDevice && !hasOfflineDevice && (
                <div className="h-full flex justify-center items-center text-center">
                    <p className="text-fg-medium">You don&apos;t have any devices! Add one to get started!</p>
                </div>
            )}
            {hasOnlineDevice && (
                <>
                    <div className="w-full pb-1 border-bg-dark flex justify-center sm:justify-start">
                        <p className="text-xs text-fg-medium">ONLINE DEVICES ({data.onlineDevices.length})</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                        {data.onlineDevices.map((device: DeviceT) =>
                            <div key={device.deviceId} className="pt-4">
                                {device.type === 'rgb_lights' ? (
                                    <RGBLightsCard key={device.deviceId} device={device} />
                                ) : (
                                    <p key={device.deviceId}>Unknown device type</p>
                                )
                                }
                            </div>
                        )}
                    </div>
                </>
            )}
            {hasOnlineDevice && hasOfflineDevice && (
                <div className="p-4" />
            )}
            {hasOfflineDevice && (
                <>
                    <div className="w-full pb-1 border-bg-dark flex justify-center sm:justify-start">
                        <p className="text-xs text-fg-medium">OFFLINE DEVICES ({data.offlineDevices.length})</p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                        {data.offlineDevices.map((device: DeviceT) =>
                            <div key={device.deviceId} className="pt-4">
                                <OfflineDeviceCard device={device} />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}