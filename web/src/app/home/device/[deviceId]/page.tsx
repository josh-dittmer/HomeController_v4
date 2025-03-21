import ControlPanel from "@/components/control_panel/control_panel";

export default async function DevicePage({ params }: { params: Promise<{ deviceId: string }> }) {
    const { deviceId } = await params;

    return (
        <ControlPanel deviceId={deviceId} />
    )
}