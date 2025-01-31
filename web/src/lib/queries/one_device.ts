import { useQuery } from "@tanstack/react-query";
import { GetOneDeviceResponseT } from "hc_models/models";
import { getOneDevice } from "../api/actions";

export const oneDeviceKey = (deviceId: string) => ['one_device', deviceId];

export const useOneDeviceQuery = (initialData: GetOneDeviceResponseT) =>
    useQuery({
        queryKey: oneDeviceKey(initialData.device.deviceId),
        queryFn: () => getOneDevice(initialData.device.deviceId),
        initialData: initialData
    });