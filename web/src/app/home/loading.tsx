import LoadingSpinner from "@/components/loading_spinner/loading_spinner";

export default function LoadingPage() {
    return (
        <div className="flex justify-center items-center h-[calc(100svh-80px)]">
            <LoadingSpinner />
        </div>
    )
}