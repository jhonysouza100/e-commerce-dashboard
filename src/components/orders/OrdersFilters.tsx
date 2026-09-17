import { FormEvent } from "react";
import { RiCloseLine, RiFilter3Line } from "@remixicon/react";
import Button from "@/ui/Button";
import { ORDER_STATUSES } from "@/components/order/interface/order.interface";
import { statusLabels } from "./order.constants";

type OrdersFiltersProps = {
  searchParams: Pick<URLSearchParams, "get">;
  onSubmit: (form: HTMLFormElement) => void;
  onReset: () => void;
};

export default function OrdersFilters({ searchParams, onSubmit, onReset }: OrdersFiltersProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(event.currentTarget);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-md bg-surface-secondary p-3 md:grid-cols-2 xl:grid-cols-6">
      <label className="grid gap-1 text-sm"><span className="font-semibold">ID de orden</span><input name="order_id" type="number" min="1" defaultValue={searchParams.get("order_id") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
      <label className="grid gap-1 text-sm"><span className="font-semibold">Estado</span><select name="status" defaultValue={searchParams.get("status") || ""} className="rounded-md border border-border bg-input px-3 py-2"><option value="">Todos</option>{ORDER_STATUSES.map((value) => <option key={value} value={value}>{statusLabels[value]}</option>)}</select></label>
      <label className="grid gap-1 text-sm"><span className="font-semibold">Importe mínimo</span><input name="min_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("min_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
      <label className="grid gap-1 text-sm"><span className="font-semibold">Importe máximo</span><input name="max_price" type="number" min="0" step="0.01" defaultValue={searchParams.get("max_price") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
      <label className="grid gap-1 text-sm"><span className="font-semibold">Desde</span><input name="from" type="date" defaultValue={searchParams.get("from") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
      <label className="grid gap-1 text-sm"><span className="font-semibold">Hasta</span><input name="to" type="date" defaultValue={searchParams.get("to") || ""} className="rounded-md border border-border bg-input px-3 py-2" /></label>
      <div className="flex items-end gap-2 md:col-span-2 xl:col-span-6">
        <Button type="submit" icon={<RiFilter3Line size={17} />} size="small">Filtrar</Button>
        <Button type="button" onClick={onReset} icon={<RiCloseLine size={17} />} size="small" variant="secondary">Limpiar</Button>
      </div>
    </form>
  );
}
