import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "transparent";
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
      [background:var(--gradient-color)]
      text-white
      hover:opacity-90
      disabled:[background:var(--surface-hover-color)]
      disabled:[color:var(--surfece-hover-color)]
    `,

    secondary: `
      bg-background
      text-foreground
      hover:opacity-90
      disabled:bg-surface-hover
    `,

    danger: `
      bg-danger
      text-white
      hover:opacity-90
      disabled:text-foreground-light
      disabled:bg-surface-hover
    `,

    transparent: `
      text-foreground
    `
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
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:active:scale-100
        ${className}
        transition-all
        duration-400
      `}
    >
      {icon && <span>{icon}</span>}
      
      {children && <div>{children}</div>}
    </button>
  );
};

export default Button;
