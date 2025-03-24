import { useMutation } from "@tanstack/react-query";
import { CreateUserRequestT } from "hc_models/models";
import { useRouter } from "next/navigation";
import { createUser } from "../api/requests";

export const createUserKey = () => ['create_user'];

export const useCreateUserMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateUserRequestT) => createUser(vars),
        mutationKey: createUserKey(),
        onSuccess: () => {
            router.refresh();
        }
    })
};