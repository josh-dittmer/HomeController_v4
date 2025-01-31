import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditDeviceRequestT } from "hc_models/models";
import { editDevice } from "../api/actions";
import { allDevicesKey } from "../queries/all_devices";
import { oneDeviceKey } from "../queries/one_device";

export const editDeviceKey = (deviceId: string) => ['edit_device', deviceId];

export const useEditDeviceMutation = (deviceId: string) => {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (vars: EditDeviceRequestT) => editDevice(deviceId, vars),
        mutationKey: editDeviceKey(deviceId),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: allDevicesKey() });
            client.invalidateQueries({ queryKey: oneDeviceKey(deviceId) });
        }
    });
}