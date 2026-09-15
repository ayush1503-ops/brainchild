import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-studio-accent focus-visible:ring-offset-2 focus-visible:ring-offset-studio-dark disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-studio-accent text-studio-light hover:bg-studio-accent/90 active:bg-studio-accent/100 shadow-lg shadow-studio-accent/30",
      secondary:
        "bg-transparent text-studio-light border border-studio-muted/50 hover:border-studio-accent/50 hover:bg-studio-accent/10 hover:text-studio-accent",
      ghost:
        "bg-transparent text-studio-muted hover:text-studio-light hover:bg-studio-light/5",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-2",
      md: "px-6 py-3 text-base gap-2",
      lg: "px-8 py-4 text-lg gap-3",
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";