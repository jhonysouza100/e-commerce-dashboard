"use client";

import { RiInformationLine } from "@remixicon/react";
import React from "react";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  title: string;
  children?: React.ReactNode;
  info?: string;
  optional?: boolean;
  showInfoIcon?: boolean;
}

const FormLabel: React.FC<FormLabelProps> = ({
  title,
  children,
  info,
  optional = false,
  showInfoIcon = false,
  className = "",
  ...props
}) => {
  return (
    <label
      {...props}
      className={`flex flex-col gap-1 text-xs ${className}`}
    >
      <span className="flex gap-1">
        {title}
        {
          info && showInfoIcon && (
            <span title={info}>
              <RiInformationLine
                size={16}
                className="text-foreground-muted"
              />
            </span>
          )
        }

        {
          optional && (
            <span className="text-xs text-foreground-muted">
              (opcional)
            </span>
          )
        }
      </span>
      {children}
    </label>
  );
};

export default FormLabel;