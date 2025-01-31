'use client';

import Menu, { MenuButton } from "@/components/ui/menu";
import DeleteDeviceWindow from "@/components/windows/device/delete";
import EditDeviceWindow from "@/components/windows/device/edit";
import { DeviceT } from "hc_models/models";
import { ArrowLeft, Pencil, Settings, Trash } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function Header({ device }: { device: DeviceT }) {
    const [menuVisible, setMenuVisible] = useState<boolean>(false);
    const [editWindowVisible, setEditWindowVisible] = useState<boolean>(false);
    const [deleteWindowVisible, setDeleteWindowVisible] = useState<boolean>(false);

    return (
        <div className="w-full h-10 flex items-center">
            <div className="w-full flex gap-2 items-center">
                <Link href="/home">
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.99 }}
                        className="p-1 rounded hover:bg-bg-dark"
                    >
                        <ArrowLeft width={25} height={25} className="text-fg-medium" />
                    </motion.div>
                </Link>
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl text-fg-medium">{device.name}</h1>
                </div>
                <div className="grow flex justify-end">
                    <div className="relative">
                        <motion.button
                            className="bg-bg-medium p-1 rounded"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMenuVisible(!menuVisible)}
                        >
                            <Settings width={15} height={15} className="text-fg-light" />
                        </motion.button>
                        <Menu visible={menuVisible}>
                            <MenuButton setVisible={setMenuVisible} title="Edit Device" Icon={Pencil} onClick={() => setEditWindowVisible(true)} cn="text-fg-dark" />
                            <MenuButton setVisible={setMenuVisible} title="Delete Device" Icon={Trash} onClick={() => setDeleteWindowVisible(true)} cn="text-red-600" />
                        </Menu>
                        <EditDeviceWindow visible={editWindowVisible} setVisible={setEditWindowVisible} device={device} />
                        <DeleteDeviceWindow visible={deleteWindowVisible} setVisible={setDeleteWindowVisible} device={device} />
                    </div>
                </div>
            </div>
        </div>
    )
}