import type { Config } from "tailwindcss";

export default {
    screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-dark': 'var(--bg-dark)',
                'bg-medium-dark': 'var(--bg-medium-dark)',
                'bg-medium': 'var(--bg-medium)',
                'bg-light': 'var(--bg-light)',
                'bg-accent': 'var(--bg-accent)',
                'bg-accent-dark': 'var(--bg-accent-dark)',
                'fg-dark': 'var(--fg-dark)',
                'fg-medium': 'var(--fg-medium)',
                'fg-light': 'var(--fg-light)',
                'fg-accent': 'var(--fg-accent)',
            },
        },
    },
    plugins: [],
} satisfies Config;
