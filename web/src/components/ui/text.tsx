export interface TextProps {
    children: string
};

export default function Text({ children }: TextProps) {
    return (
        <p className="text-sm text-fg-dark">
            {children}
        </p>
    )
}