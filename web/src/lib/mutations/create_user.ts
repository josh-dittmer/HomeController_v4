import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserRequestT } from "hc_models/models";
import { createUser } from "../api/actions";
import { myProfileKey } from "../queries/my_profile";

export const createUserKey = () => ['create_user'];

export const useCreateUserMutation = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: CreateUserRequestT) => createUser(vars),
        mutationKey: createUserKey(),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: myProfileKey() })
        }
    })
};