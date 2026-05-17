import axios from "axios";
import { ErrorResponse, handleAxiosError } from "@/utils/handleAxiosError";
import { SessionInterface } from "../interfaces/session.interface";
import { LoginDto } from "../dto/login.dto";
import env from "@/utils/handleEnviroments";

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
    return response.data;
  } catch (error) {
    handleAxiosError(error as ErrorResponse);
    throw new Error("Login fallido");
  }
}

// Obtener el token de las cookies, Verificar el token,  Devolver la información del usuario
export async function verifyRequest(token: string | undefined): Promise<SessionInterface> {
  try {
    const response = await authenticationRequest.get<SessionInterface>('/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error as ErrorResponse);
    throw new Error("Verificación fallida");
  }
}