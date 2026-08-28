import { RiAlertLine } from "@remixicon/react";

function Alert({message}: {message: string}) {
  return (
    <div className="w-full h-full grid items-center justify-center">
      <div className="alert_content -translate-y-1/2 max-w-2xl flex items-center justify-center bg-yellow-100/75 text-yellow-900 border border-yellow-400 rounded-md p-4">
        <span className="flex items-center gap-2">
          <span className="flex-shrink-0">
            <RiAlertLine className="text-yellow-600" />
          </span>
          {message}
        </span>
      </div>
    </div>
  );
}

export default Alert;