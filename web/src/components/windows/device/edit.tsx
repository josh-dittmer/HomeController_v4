import Button from "@/components/ui/button";
import TextBox from "@/components/ui/textbox";
import Window, { WindowFooter, WindowSpacer } from "@/components/ui/window";
import { useEditDeviceMutation } from "@/lib/mutations/edit_device";
import { DeviceT } from "hc_models/models";
import { MaxDeviceDescriptionLength, MaxDeviceNameLength } from "hc_models/values";
import { Pencil } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function EditDeviceWindow({ visible, setVisible, device }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, device: DeviceT }) {
    const { mutate } = useEditDeviceMutation(device.deviceId);

    const [name, setName] = useState<string>(device.name);
    const [nameValid, setNameValid] = useState<boolean>();

    const [description, setDescription] = useState<string>(device.description);
    const [descriptionValid, setDescriptionValid] = useState<boolean>();

    const valid = nameValid && descriptionValid;

    return (
        <Window visible={visible} title="Edit Device" Icon={Pencil}>
            <WindowSpacer>
                <TextBox value={name} setValue={setName} maxChars={MaxDeviceNameLength} multiline={false} setValid={setNameValid} title="Name" placeholder="Device name..." />
            </WindowSpacer>
            <WindowSpacer>
                <TextBox value={description} setValue={setDescription} maxChars={MaxDeviceDescriptionLength} multiline={true} optional setValid={setDescriptionValid} title="Description" placeholder="Device description..." />
            </WindowSpacer>
            <WindowSpacer>
                <WindowFooter>
                    <Button title="Cancel" valid={true} cn="bg-bg-medium text-fg-dark" onClick={() => {
                        setVisible(false);
                        setName(device.name);
                        setDescription(device.description);
                    }} />
                    <Button title="Save" valid={valid} cn="bg-bg-accent text-fg-accent" onClick={() => {
                        mutate({
                            name: name,
                            description: description
                        });
                        setVisible(false);
                    }} />
                </WindowFooter>
            </WindowSpacer>
        </Window>
    )
}