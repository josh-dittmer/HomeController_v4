import Button from "@/components/ui/button";
import TextBox from "@/components/ui/textbox";
import Window, { WindowFooter, WindowFooterStart, WindowSpacer } from "@/components/ui/window";
import { revokeTokens } from "@/lib/auth/actions";
import { useEditUserMutation } from "@/lib/mutations/edit_user";
import { UserT } from "hc_models/models";
import { MaxUserNameLength } from "hc_models/values";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

export default function EditUserWindow({ visible, setVisible, user }: { visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>, user: UserT }) {
    const { mutate } = useEditUserMutation();

    const [name, setName] = useState<string>(user.name);
    const [nameValid, setNameValid] = useState<boolean>();

    const valid = nameValid;

    const router = useRouter();

    return (
        <Window visible={visible} title="Edit Profile" Icon={Settings}>
            <WindowSpacer>
                <TextBox value={name} setValue={setName} maxChars={MaxUserNameLength} multiline={false} setValid={setNameValid} title="Name" placeholder="Name..." />
            </WindowSpacer>
            <WindowSpacer>
                <WindowFooter>
                    <WindowFooterStart>
                        <button onClick={async () => {
                            await revokeTokens();
                            router.push('/login?clear_session=1');
                        }}
                        >
                            <div className="flex items-center gap-1 text-red-600">
                                <LogOut width={15} height={15} />
                                <p className="text-sm ">Log out</p>
                            </div>
                        </button>
                    </WindowFooterStart>
                    <Button title="Cancel" valid={true} cn="bg-bg-medium text-fg-dark" onClick={() => {
                        setVisible(false);
                        setName(user.name);
                    }} />
                    <Button title="Save" valid={valid} cn="bg-bg-accent text-fg-accent" onClick={() => {
                        mutate({
                            name: name
                        });
                        setVisible(false);
                    }} />
                </WindowFooter>
            </WindowSpacer>
        </Window>
    )
}