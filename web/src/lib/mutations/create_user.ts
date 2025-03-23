import { useMutation } from "@tanstack/react-query";
import { CreateUserRequestT } from "hc_models/models";
import { createUserOnServer } from "./actions";

export const createUserKey = () => ['create_user'];

export const useCreateUserMutation = () => useMutation({
    mutationFn: (vars: CreateUserRequestT) => createUserOnServer(vars),
    mutationKey: createUserKey(),
    onSuccess: () => {
        //client.invalidateQueries({ queryKey: myProfileKey() })
    }
});