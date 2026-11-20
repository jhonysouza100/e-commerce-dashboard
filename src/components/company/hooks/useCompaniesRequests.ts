import axios from "axios";
import { BACKEND_URL, SESSION_COOKIE } from "@/const/constants";
import { getSessionCookie } from "@/utils/handleCookies";
import type { Company } from "../interface/company.interface";

const companiesRequest = axios.create({
  baseURL: `${BACKEND_URL}/companies`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

companiesRequest.interceptors.request.use(async (config) => {
  const token = await getSessionCookie(SESSION_COOKIE);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Retrieves the companies associated with the authenticated administrator.
 *
 * @returns Public company data returned by the API.
 * @throws An error when the request fails.
 */
export async function listAdminCompaniesRequest(): Promise<Company[]> {
  try {
    const response = await companiesRequest.get<Company[]>("");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
      const responseMessage = error.response?.data?.message;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(", ")
        : responseMessage;
      throw new Error(message || error.message || "No se pudieron obtener las compañías");
    }

    throw error;
  }
}
