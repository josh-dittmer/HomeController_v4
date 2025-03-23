'use client';

import Button from "@/components/ui/button";
import TextBox from "@/components/ui/textbox";
import Window, { WindowFooter, WindowFooterStart, WindowSpacer } from "@/components/ui/window";
import { useCreateUserMutation } from "@/lib/mutations/create_user";
import { MaxUserNameLength } from "hc_models/values";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { logout } from "./actions";

export default function CreateUserWindow({ email }: { email: string }) {
    const { mutate, isPending } = useCreateUserMutation();

    const [name, setName] = useState<string>('');
    const [nameValid, setNameValid] = useState<boolean>();

    const valid = nameValid;

    return (
        <Window visible={true} title="Complete Profile" Icon={User}>
            <WindowSpacer>
                <TextBox value={name} setValue={setName} maxChars={MaxUserNameLength} multiline={false} setValid={setNameValid} title="Name" placeholder="Name..." />
            </WindowSpacer>
            <WindowSpacer>
                <WindowFooter>
                    <WindowFooterStart>
                        <button onClick={() => logout()}
                        >
                            <div className="flex items-center gap-1 text-fg-medium">
                                <LogOut width={15} height={15} />
                                <p className="text-sm max-w-32 truncate">{email}</p>
                            </div>
                        </button>
                    </WindowFooterStart>
                    <Button title="Continue" valid={valid && !isPending} cn="bg-bg-accent text-fg-accent" onClick={() => {
                        mutate({
                            name: name
                        });
                    }} />
                </WindowFooter>
            </WindowSpacer>
        </Window>
    )
}