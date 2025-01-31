import LoadingSpinner from "@/components/loading_spinner/loading_spinner";

export default function TestPage() {
    return (
        <>
            <LoadingSpinner />
            <div className="md:bg-green-300 w-32 h-32"></div>
        </>
    )
}