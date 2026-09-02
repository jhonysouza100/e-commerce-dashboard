"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Button from "./Button";

type TriggerElement = React.ReactElement;

type ButtonProps = React.ComponentProps<typeof Button>;

export interface AlertDialogProps {
  children: TriggerElement;
  message: React.ReactNode;
  title?: React.ReactNode;
  isLoading?: boolean;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  children,
  message,
  title = "¿Estás seguro?",
  isLoading = false,
  confirmButtonProps,
  cancelButtonProps,
}) => {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    cancelButtonProps?.onClick?.(event);
    if (!event.defaultPrevented) setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        confirmButtonRef.current?.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const trigger = React.cloneElement(children as React.ReactElement<any>, {
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      setOpen(true);
    },
    "aria-haspopup": "dialog",
    "aria-expanded": open,
  });

  const handleConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmButtonProps?.onClick?.(event);
    if (event.defaultPrevented) return;

    const triggerOnClick = (children.props as { onClick?: React.MouseEventHandler }).onClick;
    triggerOnClick?.(event as unknown as React.MouseEvent);
    // setOpen(false);
  };

  return (
    <>
      {trigger}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="w-full max-w-md rounded-2xl bg-background p-6 text-foreground shadow-lg"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-3">
              <h2 id={titleId} className="text-lg font-bold text-balance">
                {title}
              </h2>
              <p id={descriptionId} className="leading-6 text-foreground-muted">
                {message}
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button 
                {...cancelButtonProps}
                type="button"
                variant={cancelButtonProps?.variant ?? "secondary"}
                onClick={handleCancel}
              >
                {cancelButtonProps?.children ?? "Cancelar"}
              </Button>
              <Button 
                {...confirmButtonProps}
                ref={confirmButtonRef}
                type="button"
                variant={confirmButtonProps?.variant ?? "danger"}
                disabled={confirmButtonProps?.disabled}
                onClick={handleConfirm}
              >
                {confirmButtonProps?.children ?? "Confirmar"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default AlertDialog;
