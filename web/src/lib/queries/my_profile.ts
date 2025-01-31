import { useQuery } from "@tanstack/react-query";
import { GetMyProfileResponseT } from "hc_models/models";
import { getMyProfile } from "../api/actions";

export const myProfileKey = () => ['my_profile'];

export const useMyProfileQuery = (initialData: GetMyProfileResponseT) =>
    useQuery({
        queryKey: myProfileKey(),
        queryFn: () => getMyProfile(),
        initialData: initialData
    });