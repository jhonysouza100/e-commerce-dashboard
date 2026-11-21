"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useCompaniesContext } from "@/components/company/context/useCompaniesContext";
import Avatar from "@/ui/Avatar";
import { useAuthContext } from "../session/context/useAuthContext";

/**
 * El evento de abrir el dropdown debe estar en el icono
 * El avatar debe ser un "Link" a profile. (En mobile todavia no se pudo mostrar el dropdown).
 */
function CompanyDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    getCompanies,
    companies,
    activeCompany,
    isLoading,
    errorMessage,
    setActiveCompany,
  } = useCompaniesContext();

  const { session, isLoading: isAuthLoading } = useAuthContext();{}

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleOpen() {
    setIsOpen((open) => !open);
    if (!companies.length && !isLoading) void getCompanies();
  }

  return (
    <div className="relative mr-2" ref={dropdownRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={
          activeCompany
            ? `Empresa activa: ${activeCompany.name}`
            : "Seleccionar empresa"
        }
        onClick={handleOpen}className="inline-flex items-center gap-2 rounded-md bg-background px-3 cursor-pointer"
      >
        <span className="truncate hidden md:flex md:items-end flex-col flex-1">
          {isLoading ? (
            <div className="flex flex-col gap-2 items-end min-w-48">
              <div
                className={`w-3/4 h-4 md:h-3 bg-surface-hover animate-pulse rounded`}
              ></div>
              <div
                className={`w-1/2 h-3 md:h-2 bg-surface-hover animate-pulse rounded`}
              ></div>
            </div>
          ) : (
            <>
              <h3 className="text-sm text-foreground font-bold hidden sm:block max-w-min truncate">
                {activeCompany?.name ?? "Seleccionar empresa"}
              </h3>
              <span className="hidden text-smaller lg:block text-clip text-wrap truncate">
                {session?.username}
              </span>
            </>
          )}
        </span>
        <div className="relative">
          <Avatar
            src={activeCompany?.picture}
            alt={activeCompany?.name}
            size="large"
            isLoading={isLoading}
          />
          <div className="absolute bottom-0 left-0 rounded-full border-2 border-solid border-background">
            <Avatar
              src={session?.picture}
              alt={session?.username}
              size="small"
              isLoading={isAuthLoading}
            />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="hidden lg:block h-2 w-2 shrink-0 rotate-45 border-b-2 border-r-2 border-current"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Compañías del administrador"
          className="absolute right-0 z-[1000] mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-border bg-background p-2 shadow-lg"
        >
          {isLoading && (
            <p className="px-3 py-2 text-sm text-foreground-muted">
              Cargando compañías...
            </p>
          )}

          {errorMessage && (
            <div className="px-3 py-2">
              <p role="alert" className="mb-2 text-sm text-danger">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={() => void getCompanies()}
                className="text-sm font-semibold text-foreground underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!isLoading && !errorMessage && companies.length === 0 && (
            <p className="px-3 py-2 text-sm text-foreground-muted">
              No hay compañías disponibles.
            </p>
          )}

          {companies.map((company) => (
            <button
              key={company.id}
              type="button"
              role="option"
              aria-selected={activeCompany?.id === company.id}
              onClick={() => {
                setActiveCompany(company);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-hover ${
                activeCompany?.id === company.id ? "bg-surface-hover" : ""
              }`}
            >
              {company.picture ? (
                <Image
                  src={company.picture}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-hover text-sm uppercase">
                  {company.name.charAt(0)}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {company.name}
                </span>
                <span className="block truncate text-xs text-foreground-muted">
                  {company.domain ?? company.email}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyDropdown;
