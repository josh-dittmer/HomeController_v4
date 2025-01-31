export function LoadingSpinnerImage({ width, height }: { width?: number, height?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width={width || 100} height={height || 100} style={{ shapeRendering: 'auto', display: 'block' }} xmlnsXlink="http://www.w3.org/1999/xlink">
            <g>
                <circle strokeDasharray="164.93361431346415 56.97787143782138" r="35" strokeWidth="10" fill="none" cy="50" cx="50" stroke="var(--bg-dark)">
                    <animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform" />
                </circle>
                <g></g>
            </g>
        </svg>
    )
}

export default function LoadingSpinner({ text }: { text?: string }) {
    return (
        <div className="flex flex-col items-center w-fit">
            <LoadingSpinnerImage />
            {text && (
                <div className="p-1 bg-bg-dark rounded">
                    <p className="text-fg-light">{text}</p>
                </div>
            )}
        </div>
    )
}