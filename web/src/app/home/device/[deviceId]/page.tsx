import ControlPanel from "@/components/control_panel/control_panel";
import { getOneDevice } from "@/lib/api/requests";
import { getAccessToken } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;

    const accessToken = getAccessToken(await cookies());
    const res = await getOneDevice(accessToken, deviceId);

    return (
        <ControlPanel res={res} />
    )
}