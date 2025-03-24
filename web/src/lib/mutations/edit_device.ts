import { useMutation } from "@tanstack/react-query";
import { EditDeviceRequestT } from "hc_models/models";
import { useRouter } from "next/navigation";
import { editDevice } from "../api/requests";

export const editDeviceKey = (deviceId: string) => ['edit_device', deviceId];

export const useEditDeviceMutation = (deviceId: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: (vars: EditDeviceRequestT) => editDevice(deviceId, vars),
        mutationKey: editDeviceKey(deviceId),
        onSuccess: () => {
            router.refresh();
        }
    })
};