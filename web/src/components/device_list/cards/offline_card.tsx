'use client';

import { DeviceT } from "hc_models/models";
import Link from "next/link";

export function OfflineDeviceCard({ device }: { device: DeviceT }) {
    return (
        <div className="bg-bg-dark rounded w-64">
            <div className="h-20">
                <div className="p-2 h-full">
                    <div className="h-full flex flex-col justify-center gap-2">
                        <div className="flex justify-center">
                            <Link href={`/home/device/${device.deviceId}`} prefetch={true}>
                                <h1 className="text-fg-light">{device.name}</h1>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-9 p-3 bg-bg-medium flex justify-center items-center rounded-b">
                <p className="text-xs text-fg-medium">
                    OFFLINE
                </p>
            </div>
        </div>
    )
}

