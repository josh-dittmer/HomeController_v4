'use client';

import Button from "@/components/ui/button";
import Text from "@/components/ui/text";
import Window, { WindowFooter, WindowSpacer } from "@/components/ui/window";
import { deleteDevice } from "@/lib/api/actions";
import { DeviceT } from "hc_models/models";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function DeleteDeviceWindow({ visible, setVisible, device }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, device: DeviceT }) {
    const [deleted, setDeleted] = useState<boolean>(false);

    const router = useRouter();

    return (
        <Window visible={visible} title="Delete Device" Icon={Trash}>
            <WindowSpacer>
                <Text>Are you sure you want to delete this device? This cannot be undone!</Text>
            </WindowSpacer>
            <WindowSpacer>
                <WindowFooter>
                    <Button title="Cancel" valid={true} cn="bg-bg-medium text-fg-dark" onClick={() => {
                        setVisible(false);
                    }} />
                    <Button title="Delete" valid={!deleted} cn="bg-red-600 text-fg-accent" onClick={async () => {
                        setDeleted(true);
                        await deleteDevice(device.deviceId);
                        router.push('/home');
                    }} />
                </WindowFooter>
            </WindowSpacer>
        </Window>
    )
}