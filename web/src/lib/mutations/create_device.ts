import { useMutation } from "@tanstack/react-query";
import { CreateDeviceRequestT } from "hc_models/models";
import { createDeviceOnServer } from "./actions";

export const createDeviceKey = () => ['create_device'];

export const useCreateDeviceMutation = () => useMutation({
    mutationFn: (vars: CreateDeviceRequestT) => createDeviceOnServer(vars),
    mutationKey: createDeviceKey(),
    onSuccess: () => {
        //client.invalidateQueries({ queryKey: allDevicesKey() })
    }
});