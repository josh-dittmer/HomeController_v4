import { LucideProps } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Dispatch, FC, ReactElement, SetStateAction } from "react";

interface MenuButtonProps {
    setVisible: Dispatch<SetStateAction<boolean>>,
    title: string,
    Icon: FC<LucideProps>,
    onClick: () => void,
    cn: string
};

export function MenuButton({ setVisible, title, Icon, onClick, cn }: MenuButtonProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
                setVisible(false);
                onClick();
            }}
        >
            <div className="gap-4 flex items-center text-left text-nowrap">
                <p className={`grow text-sm ${cn}`}>{title}</p>
                <Icon width={13} height={13} className={cn} />
            </div>
        </motion.button>
    )
}

export default function Menu({ visible, children }: { visible: boolean, children: ReactElement<MenuButtonProps> | Array<ReactElement<MenuButtonProps>> }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, transform: 'translateY(-10px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    exit={{ opacity: 0, transform: 'translateY(-10px)' }}
                    className="absolute right-0"
                >
                    <div className="mt-2 p-3 bg-bg-dark rounded-xl flex flex-col gap-4">
                        {children}
                    </div>
                </motion.div>
            )
            }
        </AnimatePresence >
    )
}