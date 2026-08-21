import axios from "axios";
import { ErrorResponse, handleAxiosError, handleAxiosSuccess } from "@/utils/handleAxiosResponses";
import { SessionInterface } from "../interfaces/session.interface";
import { LoginDto } from "../dto/login.dto";
import env from "@/utils/handleEnviroments";
import { getSessionCookie, removeSessionCookie, setSessionCookie } from "@/utils/handleCookies";
import { toast } from "sonner";

const authenticationRequest = axios.create({
  baseURL: `${env.BACKEND_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function loginRequest(credentials: LoginDto): Promise<{ token: string, payload: SessionInterface }> {
  try {
    const response = await authenticationRequest.post<{ token: string, payload: SessionInterface }>('/login', credentials);
    // Establecer el token en las cookies
    await setSessionCookie("user-token", response.data.token);
    handleAxiosSuccess(`Hola de nuevo ${response.data.payload.name}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error as ErrorResponse);
    throw new Error("Login fallido");
  }
}

export async function logoutRequest(): Promise<void> {
  await removeSessionCookie(`${"user-token"}`);
  toast("Gracias, hasta luego");
  return Promise.resolve();
}

// Obtener el token de las cookies, Verificar el token,  Devolver la información del usuario
export async function verifyRequest(): Promise<SessionInterface> {
  try {
    const authorizationToken = await getSessionCookie("user-token");  
    const response = await authenticationRequest.get<SessionInterface>('/verify', {
      headers: {
        Authorization: `Bearer ${authorizationToken}`
      }
    });
    return response.data;
  } catch (error) {
    await removeSessionCookie(`${"user-token"}`);
    handleAxiosError(error as ErrorResponse);
    throw new Error("Verificación fallida");
  }
}