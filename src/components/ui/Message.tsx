import React from "react";
import {
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiInformationLine,
} from "@remixicon/react";

export const MESSAGE_VARIANTS = [
  "danger",
  "success",
  "warning",
  "info",
  "neutral",
] as const;

export type MessageVariant = (typeof MESSAGE_VARIANTS)[number];

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: React.ReactNode;
  variant?: MessageVariant;
  icon?: React.ReactNode;
}

const variantClasses: Record<MessageVariant, string> = {
  danger: "bg-danger text-danger-foreground border-danger-border",
  success: "bg-success text-success-foreground border-success-border",
  warning: "bg-warning text-warning-foreground border-warning-border",
  info: "bg-info text-info-foreground border-info-border",
  neutral: "bg-surface-secondary text-foreground border-border",
};

const variantIcons: Record<MessageVariant, React.ReactNode> = {
  danger: <RiCloseCircleLine aria-hidden="true" />,
  success: <RiCheckboxCircleLine aria-hidden="true" />,
  warning: <RiAlertLine aria-hidden="true" />,
  info: <RiInformationLine aria-hidden="true" />,
  neutral: <RiInformationLine aria-hidden="true" />,
};

const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      message,
      variant = "neutral",
      icon,
      className = "",
      role,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      {...props}
      role={role ?? (variant === "danger" ? "alert" : "status")}
      className={`w-full h-full grid items-center justify-center`}
    >
      <div className={`-translate-y-1/2 max-w-2xl flex gap-2 items-center justify-center rounded-md px-12 py-6 ${variantClasses[variant]} ${className}`}>
        <span className="shrink-0">{icon ?? variantIcons[variant]}</span>
        <span>{message ?? children}</span>
      </div>
    </div>
  ),
);

Message.displayName = "Message";

export default Message;
