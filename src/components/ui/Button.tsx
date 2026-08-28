import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "normal" | "large";
type ButtonIconPosition = "left" | "right";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  orientation?: ButtonIconPosition;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button", variant = "primary", className = "", title, disabled = false, children, icon, orientation = "left", size = "normal", ...props }) => {
  const sizeClasses: Record<ButtonSize, string> = {
    small: "px-2 py-2 text-sm gap-1.5",
    normal: "px-4 py-2 text-base gap-2",
    large: "px-5 py-3 text-lg gap-2.5",
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: `
      bg-foreground
      text-background
      hover:opacity-90
    `,

    secondary: `
      bg-background
      text-foreground
      hover:opacity-90
    `,

    danger: `
      bg-danger
      text-danger-foreground
      hover:opacity-90
    `,
  };

  const orientationClasses = {
    left: "flex-row",
    right: "flex-row-reverse",
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      title={title}
      className={`
        inline-flex
        items-center
        justify-center
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${orientationClasses[orientation]}
        font-bold
        rounded-md
        cursor-pointer
        transition-all
        duration-200
        active:scale-[0.98]
        disabled:bg-surface-hover disabled:text-foreground-light
        disabled:cursor-not-allowed
        disabled:active:scale-100
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      
      {children && <div>{children}</div>}
    </button>
  );
};

export default Button;
