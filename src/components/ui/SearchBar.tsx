"use client";

import { RiSearch2Line } from "@remixicon/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface AvatarProps {
  placeholder?: string,
}

const SearchBar: React.FC<AvatarProps> = ({ placeholder }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback(
    // use-debounce agrega un retraso a la funcion de busqueda
    (e) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      if(e.target.value) {
        params.set("q", e.target.value);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params}`)
    },
    1000
  );

  return (
    <div className="relative w-full">
      <RiSearch2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-full bg-gray-100 rounded-full py-1 pl-10 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

export default SearchBar;
