import { useMutation } from "@tanstack/react-query";
import { CreateDeviceRequestT } from "hc_models/models";
import { useRouter } from "next/navigation";
import { createDevice } from "../api/requests";

export const createDeviceKey = () => ['create_device'];

export const useCreateDeviceMutation = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: CreateDeviceRequestT) => createDevice(vars),
        mutationKey: createDeviceKey(),
        onSuccess: () => {
            router.refresh();
        }
    })
};