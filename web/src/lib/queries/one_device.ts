import { useQuery } from "@tanstack/react-query";
import { getOneDevice } from "../api/actions";

export const oneDeviceKey = (deviceId: string) => ['one_device', deviceId];

export const useOneDeviceQuery = (deviceId: string) =>
    useQuery({
        queryKey: oneDeviceKey(deviceId),
        queryFn: () => getOneDevice(deviceId),
    });