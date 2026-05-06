import axios from "axios";
import { ErrorResponse, handleAxiosError } from "@/utils/handleAxiosError";
import { SessionInterface } from "@/common/interfaces/session.interface";
import { LoginDto } from "@/common/dtos/login.dto";
import env from "@/common/env";

const authenticationRequest = axios.create({
  baseURL: `${env.SERVER_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function loginRequest(credentials: LoginDto): Promise<{ token: string, payload: SessionInterface } | null> {
  try {
    const response = await authenticationRequest.post<{ token: string, payload: SessionInterface }>('/login', credentials);
    return response.data;
  } catch (error) {
    handleAxiosError(error as ErrorResponse);
    return null;
  }
}

// Obtener el token de las cookies, Verificar el token,  Devolver la información del usuario
export async function verifyRequest(token: string | undefined): Promise<SessionInterface | null> {
  try {
    const response = await authenticationRequest.get<SessionInterface>('/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.log((error as ErrorResponse).response?.data.message || (error as ErrorResponse).message);
    return null;
  }
}
