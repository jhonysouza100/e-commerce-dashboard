import FilterProductsButton from "@/components/product/FilterProductsButton";
import SearchBar from "@/ui/SearchBar";

export default function ProductsHeaderSlot() {
  return (
    <div className="grow sm:grow-[initial] sm:w-[50%] flex items-center gap-2">
      <SearchBar placeholder="Buscar..." />
      <FilterProductsButton />
    </div>
  );
}
