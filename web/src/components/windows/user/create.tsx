import Button from "@/components/ui/button";
import TextBox from "@/components/ui/textbox";
import Window, { WindowFooter, WindowFooterStart, WindowSpacer } from "@/components/ui/window";
import { revokeTokens } from "@/lib/auth/actions";
import { useCreateUserMutation } from "@/lib/mutations/create_user";
import { myProfileKey } from "@/lib/queries/my_profile";
import { useQueryClient } from "@tanstack/react-query";
import { MaxUserNameLength } from "hc_models/values";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUserWindow({ email }: { email: string }) {
    const { mutate, isPending } = useCreateUserMutation();

    const [name, setName] = useState<string>('');
    const [nameValid, setNameValid] = useState<boolean>();

    const valid = nameValid;

    const router = useRouter();
    const client = useQueryClient();

    return (
        <Window visible={true} title="Complete Profile" Icon={User}>
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
                            <div className="flex items-center gap-1 text-fg-medium">
                                <LogOut width={15} height={15} />
                                <p className="text-sm ">{email}</p>
                            </div>
                        </button>
                    </WindowFooterStart>
                    <Button title="Continue" valid={valid && !isPending} cn="bg-bg-accent text-fg-accent" onClick={() => {
                        mutate({
                            name: name
                        });
                        client.invalidateQueries({ queryKey: myProfileKey() });
                    }} />
                </WindowFooter>
            </WindowSpacer>
        </Window>
    )
}