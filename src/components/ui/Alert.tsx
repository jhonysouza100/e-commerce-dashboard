import { RiAlertLine } from "@remixicon/react";

function Alert({message}: {message: string}) {
  return (
    <div className="w-full h-full grid items-center justify-center">
      <div className="alert_content -translate-y-1/2 max-w-2xl flex items-center justify-center bg-warning text-warning-foreground border border-warning-border rounded-md px-12 py-6">
        <span className="flex items-center gap-2">
          <span className="flex-shrink-0">
            <RiAlertLine className="text-warning-foreground" />
          </span>
          {message}
        </span>
      </div>
    </div>
  );
}

export default Alert;