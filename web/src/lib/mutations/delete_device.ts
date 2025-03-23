import { useMutation } from "@tanstack/react-query";
import { deleteDeviceOnServer } from "./actions";

export const deleteDeviceKey = (deviceId: string) => ['delete_device', deviceId];

export const useDeleteDeviceMutation = (deviceId: string) => useMutation({
    mutationFn: () => deleteDeviceOnServer(deviceId),
    mutationKey: deleteDeviceKey(deviceId),
    onSuccess: () => {

    }
})