import { useMutation } from "@tanstack/react-query";
import { EditDeviceRequestT } from "hc_models/models";
import { editDeviceOnServer } from "./actions";

export const editDeviceKey = (deviceId: string) => ['edit_device', deviceId];

export const useEditDeviceMutation = (deviceId: string) => useMutation({
    mutationFn: (vars: EditDeviceRequestT) => editDeviceOnServer(deviceId, vars),
    mutationKey: editDeviceKey(deviceId),
    onSuccess: () => {
        //client.invalidateQueries({ queryKey: allDevicesKey() });
        //client.invalidateQueries({ queryKey: oneDeviceKey(deviceId) });
    }
});