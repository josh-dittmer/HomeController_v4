import { GatewayContextType } from "@/contexts/gateway";
import { Commands } from "@/lib/api/device_data/rgb_lights";
import { motion } from 'motion/react';

export default function ColorButton({ enabled, ctx, deviceId, r, g, b, cn }: { enabled: boolean | null, ctx: GatewayContextType | null, deviceId: string, r: number, g: number, b: number, cn: string }) {
    const setColor = (r: number, g: number, b: number) => {
        ctx?.sendCommand(deviceId, Commands.setColor(r, g, b));
    }

    return (
        <>
            {enabled ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setColor(r, g, b)}
                >
                    <div
                        style={{
                            backgroundColor: `rgb(${r}, ${g}, ${b})`
                        }}
                        className={`border border-fg-dark rounded ${cn}`}
                    />
                </motion.button>
            ) : (
                <div
                    className={`rounded bg-bg-light ${cn}`}
                />
            )}
        </>
    )
};