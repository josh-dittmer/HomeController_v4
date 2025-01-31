import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

export type ThemeName = 'dark' | 'light';

export type Theme = {
    shouldAnimate: boolean,
    name: ThemeName
}

type ThemeContextType = {
    theme: Theme,
    setTheme: Dispatch<SetStateAction<Theme>>
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children, defaultTheme }: { children: ReactNode, defaultTheme: ThemeName }) {
    const [theme, setTheme] = useState<Theme>({
        shouldAnimate: false,
        name: defaultTheme
    });

    const animation = theme.shouldAnimate ? (theme.name === 'dark' ? 'animate-switch-dark' : 'animate-switch-light') : '';

    return (
        <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme }}>
            <div className={`${theme.name} ${animation}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}