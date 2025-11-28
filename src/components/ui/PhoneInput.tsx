import { FC, ChangeEvent } from "react";
import clsx from "clsx";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
}

export const PhoneInput: FC<PhoneInputProps> = ({
                                                    value,
                                                    onChange,
                                                    className,
                                                    ...rest
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

    return (
        <input
            {...rest}
            value={value}
            onChange={handleChange}
            placeholder="Введите номер"
            inputMode="tel"
            className={clsx(
                "flex-1 rounded-xl border border-slate-300 px-3 py-2 pr-10 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "[appearance:textfield] [&::-webkit-clear-button]:hidden [&::-webkit-search-cancel-button]:hidden",
                className
            )}
        />
    );
};
