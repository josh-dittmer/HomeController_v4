import { Dispatch, SetStateAction } from "react";

export type DropdownOption<T> = {
    value: T;
    title: string;
}

interface DropdownProps<T> {
    options: DropdownOption<T>[]
    option: T;
    setOption: Dispatch<SetStateAction<T>>;
    title: string;
};

export default function Dropdown<T extends string>({ options, option, setOption, title }: DropdownProps<T>) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-fg-medium">{title}</p>
            <select
                value={option}
                onChange={(e) => setOption(e.target.value as T)}
                className="w-64 p-2 outline-none bg-bg-medium text-fg-dark text-sm"
            >
                {options.map((option) => {
                    return (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.title}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}