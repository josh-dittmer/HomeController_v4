'use client';

import { motion } from "motion/react";

export interface ButtonProps {
    title: string,
    valid: boolean | undefined,
    cn: string,
    onClick: () => void
};

export default function Button({ title, valid, cn, onClick }: ButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: valid ? 1.05 : 1 }}
            whileTap={{ scale: valid ? 0.98 : 1 }}
            onClick={onClick}
            disabled={!valid}
            className={`p-2 rounded text-sm ${valid ? cn : 'text-fg-medium bg-bg-medium'}`}
        >
            {title}
        </motion.button>
    )
}