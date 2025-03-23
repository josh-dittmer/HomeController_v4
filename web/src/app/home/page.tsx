import DeviceList from "@/components/device_list/device_list";
import { getAllDevices } from "@/lib/api/requests";
import { getAccessToken } from "@/lib/auth/cookies";
import { cookies } from "next/headers";


export default async function HomePage() {
    const accessToken = getAccessToken(await cookies());
    const res = await getAllDevices(accessToken);

    return (
        <DeviceList res={res} />
    )
}