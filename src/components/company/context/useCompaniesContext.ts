"use client";

import { create } from "zustand";
import type { Company } from "../interface/company.interface";
import { listAdminCompaniesRequest } from "../hooks/useCompaniesRequests";

interface CompaniesContextState {
  companies: Company[];
  activeCompany: Company | undefined;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  errorMessage: string | null;
  getCompanies: () => void;
  setActiveCompany: (company: Company) => void;
  clearCompanies: () => void;
}

export const useCompaniesContext = create<CompaniesContextState>((set, get) => ({
  companies: [],
  activeCompany: undefined,
  isLoading: true,
  errorMessage: null,

  getCompanies: async (): Promise<void> => {
    try {
      set((state) => ({ ...state, errorMessage: null }));
      const companies = await listAdminCompaniesRequest();
      if(!companies) return;

      // Check if there's a selected company in localStorage and set it as activeCompany
      const selectedCompanyId = localStorage.getItem("activeCompanyId");
      if (selectedCompanyId) {
        const selectedCompany = companies.find((company) => company.id === parseInt(selectedCompanyId));
        if (selectedCompany) {
          set((state) => ({ ...state, activeCompany: selectedCompany }));
        }
      }
      set((state) => ({ ...state, companies }));
    } catch (error) {
      set((state) => ({ ...state, isLoading: false, errorMessage: "Error fetching companies" }));
    } finally {
      set((state) => ({ ...state, isLoading: false }));
    }
  },

  setIsLoading: (isLoading: boolean) => {
    set(() => ({ isLoading: isLoading }));
  },

  setActiveCompany: (activeCompany) => {
    // Store the selected company ID in localStorage
    if (activeCompany) {
      localStorage.setItem("activeCompanyId", activeCompany.id.toString());
    }
    set({ activeCompany })
  },
  
  clearCompanies: () => set({
    companies: [],
    activeCompany: undefined,
    errorMessage: null,
  }),
}));
