import { LucideProps } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FC, ReactElement, ReactNode } from "react";
import { ButtonProps } from "./button";
import { TextProps } from "./text";
import { TextBoxProps } from "./textbox";

interface WindowFooterProps {
    children: ReactElement<ButtonProps> | Array<ReactElement<ButtonProps>>
};

export function WindowFooter({ children }: WindowFooterProps) {
    return (
        <div className="flex gap-2 justify-end">
            {children}
        </div>
    )
}

export function WindowFooterStart({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center grow">
            {children}
        </div>
    )
}

interface WindowSpacerProps {
    children: ReactElement<WindowFooterProps> | ReactElement<TextBoxProps> | ReactElement<TextProps>
}

export function WindowSpacer({ children }: WindowSpacerProps) {
    return (
        <div className="mt-4">
            {children}
        </div>
    )
}

export default function Window({ visible, title, Icon, children }: { visible: boolean, title: string, Icon: FC<LucideProps>, children: ReactElement<WindowSpacerProps> | Array<ReactElement<WindowSpacerProps>> }) {
    return (
        <AnimatePresence>
            {visible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.75 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 z-10 w-svw h-svh bg-black"
                    />
                    <div
                        className="fixed top-0 left-0 z-20 w-svw h-svh flex justify-center items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, transform: 'translateY(10px)' }}
                            animate={{ opacity: 1, transform: 'translateY(0px)' }}
                            exit={{ opacity: 0, transform: 'translateY(10px)' }}
                            className="bg-bg-light rounded p-4 max-w-80">
                            <div className="flex items-center gap-4">
                                <Icon width={20} height={20} className="text-fg-dark" />
                                <h1 className="text-fg-dark text-lg">{title}</h1>
                            </div>
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}