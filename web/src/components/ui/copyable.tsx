'use client';

import { Copy } from "lucide-react";
import { motion } from "motion/react";

export interface CopyableProps {
    title: string,
    children: string
};

export default function Copyable({ title, children }: CopyableProps) {
    const copyText = () => {
        navigator.clipboard.writeText(children);
    };

    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-fg-medium">{title}</p>
            <motion.div
                className="w-full min-w-64 p-2 bg-bg-medium flex flex-col"
            >
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={children}
                        readOnly
                        className="bg-transparent outline-none text-sm text-fg-dark grow"
                    />
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={copyText}
                    >
                        <Copy width={15} height={15} className="text-fg-dark" />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}