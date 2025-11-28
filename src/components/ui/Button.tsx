import { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    full?: boolean;
}

export const Button: FC<ButtonProps> = ({
                                            children,
                                            variant = "primary",
                                            size = "md",
                                            full = false,
                                            className,
                                            ...rest
                                        }) => {
    const base =
        "rounded-xl font-medium transition active:scale-[0.97] select-none";

    const variants: Record<Variant, string> = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 cursor-pointer",
        secondary:
            "bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-100 cursor-pointer",
        outline:
            "border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:text-slate-400 cursor-pointer",
        danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 cursor-pointer",
    };

    const sizes: Record<Size, string> = {
        sm: "text-xs py-1.5 px-3",
        md: "text-sm py-2 px-4",
        lg: "text-base py-3 px-5",
    };

    return (
        <button
            className={clsx(
                base,
                variants[variant],
                sizes[size],
                full && "w-full",
                className
            )}
            {...rest}
        >
            {children}
        </button>
    );
};
