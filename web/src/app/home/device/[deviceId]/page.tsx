import ControlPanel from "@/components/control_panel/control_panel";
import { getOneDevice } from "@/lib/api/actions";
import { GetOneDeviceResponseT } from "hc_models/models";

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;
    const res: GetOneDeviceResponseT = await getOneDevice(deviceId);

    return (
        <ControlPanel res={res} />
    )
}