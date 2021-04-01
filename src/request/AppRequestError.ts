import { AxiosError } from "axios";

import { AppError, AppErrorValue } from "../AppError";

export class AppRequestError extends AppError {
  static isRequestError(data: any): data is AppRequestError {
    return data instanceof AppRequestError;
  }

  static buildFromAxiosError(error: AxiosError) {
    return new AppRequestError({ message: error.message, errors: {} }, error.response?.status ?? -1, error);
  }

  constructor(
    private _error: { message: string; errors: Record<string, AppErrorValue> },
    public statusCode: number,
    public axiosError?: AxiosError,
  ) {
    super();
    this.setMessage(_error.message);
    this.setErrors(_error.errors);
  }
}
