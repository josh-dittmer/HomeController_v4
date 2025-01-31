import DeviceList from "@/components/device_list/device_list";
import { getAllDevices } from "@/lib/api/actions";
import { GetAllDevicesResponseT } from "hc_models/models";


export default async function HomePage() {
    const res: GetAllDevicesResponseT = await getAllDevices();

    return (
        <DeviceList res={res} />
    )
}