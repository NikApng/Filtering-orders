import { FC, ChangeEvent, FocusEventHandler } from "react";
import clsx from "clsx";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    onFocus?: FocusEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const PhoneInput: FC<PhoneInputProps> = ({
                                                    value,
                                                    onChange,
                                                    className,
                                                    placeholder = "+7 (___) ___-__-__",
                                                    onFocus,
                                                    onBlur,
                                                }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");

        let formatted = "+7";

        if (raw.length > 1) formatted += ` (${raw.slice(1, 4)}`;
        if (raw.length >= 4) formatted += `) ${raw.slice(4, 7)}`;
        if (raw.length >= 7) formatted += `-${raw.slice(7, 9)}`;
        if (raw.length >= 9) formatted += `-${raw.slice(9, 11)}`;

        onChange(formatted);
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className={clsx("relative", className)}>
            <input
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                inputMode="tel"
                onFocus={onFocus}
                onBlur={onBlur}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-lg leading-none"
                >
                    ✕
                </button>
            )}
        </div>
    );
};
