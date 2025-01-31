import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditUserRequestT } from "hc_models/models";
import { editUser } from "../api/actions";
import { myProfileKey } from "../queries/my_profile";

export const editUserKey = () => ['edit_user'];

export const useEditUserMutation = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: EditUserRequestT) => editUser(vars),
        mutationKey: editUserKey(),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: myProfileKey() });
        }
    });
}