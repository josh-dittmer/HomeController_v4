import { useMutation } from "@tanstack/react-query";
import { EditUserRequestT } from "hc_models/models";
import { useRouter } from "next/navigation";
import { editUser } from "../api/requests";

export const editUserKey = () => ['edit_user'];

export const useEditUserMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: EditUserRequestT) => editUser(vars),
        mutationKey: editUserKey(),
        onSuccess: () => {
            router.refresh();
        }
    })
};