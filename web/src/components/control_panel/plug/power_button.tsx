import { LoadingSpinnerImage } from "@/components/loading_spinner/loading_spinner";
import { GatewayContextType } from "@/contexts/gateway";
import { Commands, PlugStateT } from "@/lib/api/device_data/plug";
import { UUID } from "io-ts-types";
import { Power } from "lucide-react";
import { motion } from 'motion/react';
import { useEffect, useState } from "react";

export default function PowerButton({ enabled, ctx, deviceId, state, width, height }: { enabled: boolean | null, ctx: GatewayContextType | null, deviceId: UUID, state: PlugStateT | null, width: number, height: number }) {
    const [cooldownProgress, setCooldownProgress] = useState<number>(1);

    useEffect(() => {
        if (!state) return;

        const UPDATES_PER_SECOND = 60;
        const COOLDOWN = state.lockDuration + 250;
        const INCREMENT = 1 / ((COOLDOWN / 1000) * UPDATES_PER_SECOND);

        const intervalId = setInterval(() => {
            setCooldownProgress((o) => {
                if (o < 1) {
                    return o + INCREMENT;
                }

                return o;
            });
        }, 1000 / UPDATES_PER_SECOND);

        return () => clearInterval(intervalId);
    }, [state]);

    if (!enabled) {
        return (
            <div className="bg-bg-light rounded-full p-3 w-fit h-fit">
                <LoadingSpinnerImage width={width} height={height} />
            </div>
        )
    }

    const powered = state?.powerState === 'on' || state?.powerState === 'onLocked';
    const ready = state?.powerState === 'on' || state?.powerState === 'off';

    const togglePower = () => {
        if (!ready) {
            return;
        }

        ctx?.sendCommand(deviceId, powered ? Commands.powerOff() : Commands.powerOn());
        setCooldownProgress(0);
    };

    return (
        <motion.button
            className={`rounded-full p-3`}
            //initial={{ scale: 0.75 }}
            //animate={{ scale: 1 }}
            whileHover={{ scale: ready ? 1.05 : 1 }}
            whileTap={{ scale: ready ? 0.96 : 1 }}
            onClick={togglePower}
            style={{ background: `conic-gradient(${powered ? 'var(--bg-accent)' : 'var(--bg-medium)'} ${cooldownProgress}turn, ${powered ? 'var(--bg-accent-dark)' : 'var(--bg-dark)'} ${cooldownProgress}turn)` }}
        >
            <Power width={width} height={height} className={`${powered ? 'text-fg-accent' : 'text-fg-light'}`} />
        </motion.button>
    )
}   