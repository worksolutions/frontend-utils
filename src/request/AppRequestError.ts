import { AxiosError } from "axios";

import { AppError, AppErrorValue } from "../AppError";

export class AppRequestError extends AppError {
  static isRequestError(data: any): data is AppRequestError {
    return data instanceof AppRequestError;
  }

  constructor(
    private error: { message: string; errors: Record<string, AppErrorValue> },
    public statusCode: number,
    public axiosError?: AxiosError,
  ) {
    super();
    this.setMessage(error.message);
    this.setErrors(error.errors);
  }
}
