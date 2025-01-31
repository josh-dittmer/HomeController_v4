import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateDeviceRequestT } from "hc_models/models";
import { createDevice } from "../api/actions";
import { allDevicesKey } from "../queries/all_devices";

export const createDeviceKey = () => ['create_device'];

export const useCreateDeviceMutation = () => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: CreateDeviceRequestT) => createDevice(vars),
        mutationKey: createDeviceKey(),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: allDevicesKey() })
        }
    })
};