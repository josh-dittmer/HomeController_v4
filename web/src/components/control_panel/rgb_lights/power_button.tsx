import { LoadingSpinnerImage } from "@/components/loading_spinner/loading_spinner";
import { GatewayContextType } from "@/contexts/gateway";
import { Commands } from "@/lib/api/device_data/rgb_lights";
import { UUID } from "io-ts-types";
import { Power } from "lucide-react";
import { motion } from 'motion/react';


export default function PowerButton({ enabled, ctx, deviceId, powered, width, height }: { enabled: boolean | null, ctx: GatewayContextType | null, deviceId: UUID, powered?: boolean, width: number, height: number }) {
    const togglePower = () => {
        ctx?.sendCommand(deviceId, powered ? Commands.powerOff() : Commands.powerOn());
    };

    if (!enabled) {
        return (
            <div className="bg-bg-light rounded-full p-3 w-fit h-fit">
                <LoadingSpinnerImage width={width} height={height} />
            </div>
        )
    }

    return (
        <motion.button
            className={`${powered ? 'bg-bg-accent' : 'bg-bg-light'} rounded-full p-3`}
            //initial={{ scale: 0.75 }}
            //animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={togglePower}
        >
            <Power width={width} height={height} className={`${powered ? 'text-fg-accent' : 'text-fg-light'}`} />
        </motion.button>
    )
}   