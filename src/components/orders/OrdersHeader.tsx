import { RiRefreshLine } from "@remixicon/react";

type OrdersHeaderProps = {
  onRefresh: () => void;
};

export default function OrdersHeader({ onRefresh }: OrdersHeaderProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-foreground">Órdenes</h1>
        <p className="text-sm text-foreground-muted">Consulta y administra las compras de tu tienda.</p>
      </div>
      <button type="button" onClick={onRefresh} title="Actualizar órdenes" aria-label="Actualizar órdenes" className="rounded-md p-2 text-foreground hover:bg-surface-hover">
        <RiRefreshLine />
      </button>
    </div>
  );
}
