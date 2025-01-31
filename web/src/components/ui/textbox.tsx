'use client';

import { Dispatch, SetStateAction, useCallback, useEffect } from "react";

export interface TextBoxProps {
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    maxChars: number,
    multiline: boolean,
    optional?: boolean,
    setValid: Dispatch<SetStateAction<boolean | undefined>>,
    title: string,
    placeholder: string
};

export default function TextBox({ value, setValue, multiline, optional, maxChars, setValid, title, placeholder }: TextBoxProps) {
    const isValid = useCallback((value: string) =>
        (optional || value.length > 0) && value.length <= maxChars, [maxChars, optional]);

    useEffect(() => {
        setValid(isValid(value));
    }, [value, isValid, setValid]);

    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-fg-medium">{title}</p>
            <div className="w-64 p-2 bg-bg-medium flex flex-col">
                <div className="flex items-center gap-2">
                    {!multiline ? (
                        <>
                            <input
                                type="text"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                placeholder={placeholder}
                                className="bg-transparent outline-none text-sm text-fg-dark grow"
                            />
                        </>
                    ) : (
                        <textarea
                            rows={2}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="bg-transparent outline-none text-sm text-fg-dark resize-none grow"
                        />
                    )}
                    <p className={`text-xs ${isValid(value) ? 'text-fg-light' : 'text-red-600'}`}>{value.length}/{maxChars}</p>
                </div>
            </div>
        </div>
    )
}