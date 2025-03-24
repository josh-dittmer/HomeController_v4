import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteDevice } from "../api/requests";

export const deleteDeviceKey = (deviceId: string) => ['delete_device', deviceId];

export const useDeleteDeviceMutation = (deviceId: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: () => deleteDevice(deviceId),
        mutationKey: deleteDeviceKey(deviceId),
        onSuccess: () => {
            router.push('/home');
        }
    });
}