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

export function handleAxiosErrorResponse(error: ErrorResponse) {
  // console.log(error);
  toast.error(error.response?.data.message || error.message);
}

export function handleAxiosSuccessResponse(message: string) {
  toast.success(message);
}
