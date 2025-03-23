import { useMutation } from "@tanstack/react-query";
import { EditUserRequestT } from "hc_models/models";
import { editUserOnServer } from "./actions";

export const editUserKey = () => ['edit_user'];

export const useEditUserMutation = () => useMutation({
    mutationFn: (vars: EditUserRequestT) => editUserOnServer(vars),
    mutationKey: editUserKey(),
    onSuccess: () => {
        //client.invalidateQueries({ queryKey: myProfileKey() });
    }
});