import { RiLoader3Line } from "@remixicon/react";

function Loading({ message }: { message?: string }) {
  return (
    <div className="w-full h-full grid items-center justify-center">
      <div className="loading_content align-middle -translate-y-1/2 flex gap-2 items-center justify-center rounded-md p-4 ">
        <RiLoader3Line size={38} className="animate-spin" />
        <span className="font-semibold text-lg">Cargando {message?.toLocaleLowerCase()}</span>
      </div>
    </div>
  );
}

export default Loading;
