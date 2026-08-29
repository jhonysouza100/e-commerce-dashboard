import { RiLoader4Fill } from "@remixicon/react";

function Loading({ message }: { message?: string }) {
  return (
    <div className="w-full h-full grid items-center justify-center">
      <div className="loading_content -translate-y-1/2 flex gap-2 items-end justify-center rounded-md p-4">
        <RiLoader4Fill className="animate-spin" />
        <span className="font-semibold text-xl">Cargando {message?.toLocaleLowerCase()}</span>
      </div>
    </div>
  );
}

export default Loading;
