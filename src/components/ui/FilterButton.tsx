import { RiFilterLine } from "@remixicon/react";

const FilterButton = () => {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md bg-background px-3 cursor-pointer"
    >
      <span className="truncate text-sm hidden md:flex md:items-end flex-col flex-1">
        Filtros
      </span>
      <RiFilterLine size={20} />
    </button>
  );
};

export default FilterButton;