'use client';

import { GatewayContextType } from "@/contexts/gateway";
import { Commands } from "@/lib/api/device_data/rgb_lights";
import { ColorResult, HuePicker } from "react-color";

export default function ColorPicker({ ctx, deviceId, r, g, b }: { ctx: GatewayContextType | null, deviceId: string, r: number, g: number, b: number }) {
    const handleChange = (color: ColorResult) => {
        ctx?.sendCommand(deviceId, Commands.setColor(color.rgb.r, color.rgb.g, color.rgb.b));
    }

    return (
        <div className="p-4">
            <HuePicker width={'175px'} color={{ r, g, b }} onChange={handleChange} />
        </div>
    )
}