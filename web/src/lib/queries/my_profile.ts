import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api/actions";

export const myProfileKey = () => ['my_profile'];

export const useMyProfileQuery = () =>
    useQuery({
        queryKey: myProfileKey(),
        queryFn: () => getMyProfile()
    });