import { useQuery } from "@tanstack/react-query";
import { GetAllDevicesResponseT } from "hc_models/models";
import { getAllDevices } from "../api/actions";

export const allDevicesKey = () => ['all_devices'];

export const useAllDevicesQuery = (initialData: GetAllDevicesResponseT) =>
    useQuery({
        queryKey: allDevicesKey(),
        queryFn: () => getAllDevices(),
        initialData: initialData
    });