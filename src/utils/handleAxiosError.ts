import { toast } from "sonner";

export interface OkResponse {
  message: string,
}

export interface ErrorResponse {
  message: string,
  response?: {
    data: {
      message: string,
      statusCode: number,
    }
  }
}

export function handleAxiosError(error: ErrorResponse) {
  // console.log(error);
  toast(error.response?.data.message || error.message);
}
