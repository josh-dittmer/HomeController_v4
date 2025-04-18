'use client';

import { GatewayProvider } from "@/contexts/gateway";
import { Lamp, LucideProps, Plus, Settings, Smartphone } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import ThemeToggle from "../theme_toggle/theme_toggle";
import AddDeviceWindow from "../windows/device/add";
import EditUserWindow from "../windows/user/edit";

import { TicketResponseT, UserT } from "hc_models/models";
import './css/home.css';

function NavItem({ title, Icon }: { title: string, Icon: FC<LucideProps> }) {
    return (
        <motion.div
            className="p-2 w-full rounded flex gap-4 items-center hover:bg-bg-dark"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.99 }}
        >
            <Icon width={15} height={15} className="text-fg-dark" />
            <p className="text-sm text-fg-dark hidden sm:block">{title}</p>
        </motion.div>
    )
}

export default function Home({ user, ticketRes, children }: { user: UserT, ticketRes: TicketResponseT, children: ReactNode }) {
    const [addDeviceWindowVisible, setAddDeviceWindowVisible] = useState<boolean>(false);
    const [editUserWindowVisible, setEditUserWindowVisible] = useState<boolean>(false);

    return (
        <div className="animate-fade-in grid w-svw h-svh grid-rows-[60px_1fr_20px]">
            <div className="bg-bg-dark flex justify-between items-center p-4">
                <div className="flex gap-2 items-center">
                    <Lamp width={20} height={20} className="text-fg-medium" />
                    <h1 className="text-fg-medium text-lg">HomeController</h1>
                </div>
                <div>
                    <ThemeToggle />
                </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[200px_1fr]">
                <div className="bg-bg-medium p-2 flex flex-col justify-center sm:justify-start gap-10 sm:gap-0">
                    <Link href="/home">
                        <NavItem title="My Devices" Icon={Smartphone} />
                    </Link>
                    <button onClick={() => setAddDeviceWindowVisible(true)}>
                        <NavItem title="Add Device" Icon={Plus} />
                    </button>
                    <button onClick={() => setEditUserWindowVisible(true)}>
                        <NavItem title="Settings" Icon={Settings} />
                    </button>
                </div>
                <div className="">
                    <GatewayProvider ticket={ticketRes.ticket}>
                        {children}
                    </GatewayProvider>
                </div>
            </div>
            <div className="pl-2 flex items-center bg-bg-dark">
                <p className="text-xs text-fg-medium">HomeController v4 <span className="text-fg-dark bg-red-600 rounded">Alpha</span> | <a href="https://github.com/josh-dittmer/HomeController_v4" target="_blank" className="underline">GitHub</a></p>
            </div>
            <AddDeviceWindow visible={addDeviceWindowVisible} setVisible={setAddDeviceWindowVisible} />
            <EditUserWindow visible={editUserWindowVisible} setVisible={setEditUserWindowVisible} user={user} />
        </div>
    )
}