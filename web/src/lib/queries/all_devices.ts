import { useQuery } from "@tanstack/react-query";
import { getAllDevices } from "../api/actions";

export const allDevicesKey = () => ['all_devices'];

export const useAllDevicesQuery = () =>
    useQuery({
        queryKey: allDevicesKey(),
        queryFn: () => getAllDevices()
    });