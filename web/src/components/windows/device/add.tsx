'use client';

import { useCreateDeviceMutation } from "@/lib/mutations/create_device";
import { DeviceTypeT, MaxDeviceDescriptionLength, MaxDeviceNameLength } from "hc_models/values";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { LoadingSpinnerImage } from "../../loading_spinner/loading_spinner";
import Button from "../../ui/button";
import Copyable from "../../ui/copyable";
import Dropdown, { DropdownOption } from "../../ui/dropdown";
import Text from "../../ui/text";
import TextBox from "../../ui/textbox";
import Window, { WindowFooter, WindowSpacer } from "../../ui/window";

export default function AddDeviceWindow({ visible, setVisible }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>> }) {
    const { mutate, isPending, isSuccess, data, reset } = useCreateDeviceMutation();

    const [type, setType] = useState<DeviceTypeT>('rgb_lights');

    const [name, setName] = useState<string>('');
    const [nameValid, setNameValid] = useState<boolean>();

    const [description, setDescription] = useState<string>('');
    const [descriptionValid, setDescriptionValid] = useState<boolean>();

    const valid = nameValid && descriptionValid;

    const typeOptions: DropdownOption<DeviceTypeT>[] = [
        { value: 'plug', title: 'Plug' },
        { value: 'rgb_lights', title: 'Light' },
        { value: 'test_device', title: 'Test Device' }
    ];

    return (
        <Window visible={visible} title="Add Device" Icon={Plus}>
            <>
                {!isPending && !isSuccess && (
                    <>
                        <WindowSpacer>
                            <Dropdown options={typeOptions} option={type} setOption={setType} title="Type" />
                        </WindowSpacer>
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
                                }} />
                                <Button title="Add" valid={valid} cn="bg-bg-accent text-fg-accent" onClick={() => {
                                    mutate({
                                        type: type,
                                        name: name,
                                        description: description
                                    })
                                }} />
                            </WindowFooter>
                        </WindowSpacer>
                    </>
                )}
                {isPending && (
                    <div className="flex w-32 h-32 justify-center items-center">
                        <LoadingSpinnerImage width={75} height={75} />
                    </div>
                )}
                {isSuccess && (
                    <>
                        <WindowSpacer>
                            <Text>Please configure your device with the values listed below. Once you close this window, you can&apos;t see them again!</Text>
                        </WindowSpacer>
                        <WindowSpacer>
                            <Copyable title="Device ID">
                                {data.deviceId}
                            </Copyable>
                        </WindowSpacer>
                        <WindowSpacer>
                            <Copyable title="Device Secret">
                                {data.secret}
                            </Copyable>
                        </WindowSpacer>
                        <WindowSpacer>
                            <WindowFooter>
                                <Button title="Close" valid={true} cn="bg-bg-accent text-fg-accent" onClick={() => {
                                    reset();
                                    setType('rgb_lights');
                                    setName('');
                                    setDescription('');
                                    setVisible(false);
                                }} />
                            </WindowFooter>
                        </WindowSpacer>
                    </>
                )}
            </>
        </Window>
    )
}