import { GatewayContextType } from "@/contexts/gateway";
import { Commands, RGBLightsProgramT } from "@/lib/api/device_data/rgb_lights";
import { motion } from 'motion/react';

export function RainbowIcon({ cn }: { cn: string }) {
    return (
        <div
            style={{
                background: `linear-gradient(
                90deg,
                rgba(255, 0, 0, 1) 10%,
                rgba(255, 154, 0, 1) 20%,
                rgba(208, 222, 33, 1) 30%,
                rgba(79, 220, 74, 1) 40%,
                rgba(63, 218, 216, 1) 50%,
                rgba(47, 201, 226, 1) 60%,
                rgba(28, 127, 238, 1) 70%,
                rgba(95, 21, 242, 1) 80%,
                rgba(186, 12, 248, 1) 90%,
                rgba(251, 7, 217, 1) 100%
            )`
            }}
            className={`rounded ${cn}`}
        />
    )
}

export default function ProgramButton({ enabled, ctx, deviceId, program, selectedProgram, cn }: { enabled: boolean | null, ctx: GatewayContextType | null, deviceId: string, program: RGBLightsProgramT, selectedProgram?: RGBLightsProgramT, cn: string }) {
    const startProgram = (program: RGBLightsProgramT) => {
        ctx?.sendCommand(deviceId, Commands.startProgram(program));
    };

    const running = program === selectedProgram;

    return (
        <>
            {enabled ? (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: running ? 1.25 : 1 }}
                    whileHover={{ scale: running ? 1.3 : 1.05 }}
                    whileTap={{ scale: running ? 1.21 : 0.96 }}
                    onClick={() => startProgram(program)}
                >
                    <div className="border border-fg-dark rounded">
                        {program === 'rainbowFade' ? (
                            <RainbowIcon cn={cn} />
                        ) : (
                            <p>?</p>
                        )}
                    </div>
                </motion.button>
            ) : (
                <div
                    className={`rounded bg-bg-light ${cn}`}
                />
            )}
        </>
    )
}