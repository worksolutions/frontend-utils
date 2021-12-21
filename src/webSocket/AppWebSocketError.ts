import { AppError, AppErrorValue } from "../AppError";

export class AppWebSocketError extends AppError {
  static isWebSocketError(data: any): data is AppWebSocketError {
    return data instanceof AppWebSocketError;
  }

  static buildFromInternalWebSocketError(webSocketError: any) {
    return new AppWebSocketError({ message: webSocketError.message, errors: {} }, webSocketError);
  }

  constructor(private _error: { message: string; errors: Record<string, AppErrorValue> }, public webSocketError?: any) {
    super();
    this.setMessage(_error.message);
    this.setErrors(_error.errors);
  }
}
