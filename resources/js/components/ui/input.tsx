import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ error, className, type, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "flex w-full relative h-10",
                    className,
                    "bg-transparent"
                )}
            >
                <input
                    type={type}
                    className={cn(
                        "flex flex-1 w-full h-9 rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-75",
                        className,
                        error && "border-destructive"
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="absolute -bottom-[12px] right-0 text-xs text-destructive">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
