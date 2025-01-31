'use client';

import { ThemeContext } from "@/contexts/theme";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useContext } from "react";
import '../../app/globals.css';

export default function ThemeToggle() {
    const theme = useContext(ThemeContext);

    const switchTheme = () => {
        theme?.setTheme(
            theme?.theme.name === 'dark' ?
                { shouldAnimate: true, name: 'light' }
                : { shouldAnimate: true, name: 'dark' }
        )
    };

    return (
        <motion.button
            className="bg-bg-medium p-1 rounded" onClick={switchTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {theme?.theme.name === 'light' ? (
                <Moon width={15} height={15} className="text-fg-light"></Moon>
            ) : (
                <Sun width={15} height={15} className="text-fg-light"></Sun>
            )}
        </motion.button>
    )
}