import axios from "axios";
import { ErrorResponse, handleAxiosErrorResponse, handleAxiosSuccessResponse } from "@/utils/handleAxiosResponses";
import { SessionInterface } from "../interfaces/session.interface";
import { LoginDto } from "../dto/login.dto";
import { getSessionCookie, removeSessionCookie, setSessionCookie } from "@/utils/handleCookies";
import { toast } from "sonner";
import { BACKEND_URL, SESSION_COOKIE } from "@/const/constants";

const authenticationRequest = axios.create({
  baseURL: `${BACKEND_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function loginRequest(credentials: LoginDto): Promise<{ token: string, payload: SessionInterface }> {
  try {
    const response = await authenticationRequest.post<{ token: string, payload: SessionInterface }>('/login', credentials);
    // Establecer el token en las cookies
    await setSessionCookie(SESSION_COOKIE, response.data.token);
    handleAxiosSuccessResponse(`Hola de nuevo ${response.data.payload.name}`);
    return response.data;
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("Login fallido");
  }
}

export async function logoutRequest(): Promise<void> {
  await removeSessionCookie(`${SESSION_COOKIE}`);
  toast("Gracias, hasta luego");
  return Promise.resolve();
}

// Obtener el token de las cookies, Verificar el token,  Devolver la información del usuario
export async function verifyRequest(): Promise<SessionInterface> {
  try {
    const authorizationToken = await getSessionCookie(SESSION_COOKIE);  
    const response = await authenticationRequest.get<SessionInterface>('/verify', {
      headers: {
        Authorization: `Bearer ${authorizationToken}`
      }
    });
    return response.data;
  } catch (error) {
    await removeSessionCookie(`${SESSION_COOKIE}`);
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("Verificación fallida");
  }
}