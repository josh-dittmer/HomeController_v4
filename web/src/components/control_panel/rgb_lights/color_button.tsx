import { GatewayContextType } from "@/contexts/gateway";
import { Commands } from "@/lib/api/device_data/rgb_lights";
import { UUID } from "io-ts-types";
import { motion } from 'motion/react';

export default function ColorButton({ enabled, ctx, deviceId, r, g, b, selectedR, selectedG, selectedB, cn }: { enabled: boolean | null, ctx: GatewayContextType | null, deviceId: UUID, r: number, g: number, b: number, selectedR: number | undefined, selectedG: number | undefined, selectedB: number | undefined, cn: string }) {
    const setColor = () => {
        if (r === selectedR && g === selectedG && b === selectedB) {
            ctx?.sendCommand(deviceId, Commands.powerOff());
        }

        else {
            ctx?.sendCommand(deviceId, Commands.setColor(r, g, b));
        }
    }

    return (
        <>
            {enabled ? (
                <motion.button
                    initial={{ scale: 0.75 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setColor()}
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