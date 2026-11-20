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

/**
 * Authenticates a user and stores the returned session token.
 *
 * @param credentials User credentials used to authenticate.
 * @returns The decoded session payload.
 * @throws An error when authentication or token decoding fails.
 */
export async function loginRequest(credentials: LoginDto): Promise<{ payload: SessionInterface }> {
  try {
    const response = await authenticationRequest.post<{ token: string }>('/login', credentials);
    // Establecer el token en las cookies
    await setSessionCookie(SESSION_COOKIE, response.data.token);
    
    // 1. Separar el token y obtener la parte del medio (index 1)
    const base64Url = response.data.token.split('.')[1];

    // 2. Reemplazar caracteres específicos de Base64URL a Base64 estándar
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 3. Decodificar la cadena Base64 a texto y convertirla en un objeto JSON
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload: SessionInterface = JSON.parse(jsonPayload);
    
    handleAxiosSuccessResponse(`Hola de nuevo ${payload.username}`);

    return { payload };
  } catch (error) {
    handleAxiosErrorResponse(error as ErrorResponse);
    throw new Error("Login fallido");
  }
}

/**
 * Removes the current session token and notifies the user that the session ended.
 *
 * @returns A promise that resolves after the session cookie is removed.
 */
export async function logoutRequest(): Promise<void> {
  await removeSessionCookie(`${SESSION_COOKIE}`);
  toast("Gracias, hasta luego");
  return Promise.resolve();
}

/**
 * Verifies the current session token and returns the authenticated user.
 *
 * @returns The session data associated with the current token.
 * @throws An error when the token is missing or cannot be verified.
 */
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