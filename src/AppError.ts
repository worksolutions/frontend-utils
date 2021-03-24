import { action, observable } from "mobx";

export type AppErrorValue = string | undefined;

export class AppError {
  static isAppError(value: any): value is AppError {
    return value instanceof AppError;
  }

  @observable
  private message = "";

  @observable
  private errors: Record<string, AppErrorValue> = {};

  @action.bound
  hasErrors() {
    return Object.keys(this.errors).length !== 0;
  }

  @action.bound
  clearErrors() {
    this.message = "";
    this.errors = {};
  }

  @action.bound
  setError(name: string, error: AppErrorValue) {
    this.errors[name] = error;
    this.runErrorsObserver();
  }

  @action.bound
  setErrors(errors: Record<string, AppErrorValue>) {
    this.errors = errors;
    this.runErrorsObserver();
  }

  @action.bound
  getErrors() {
    return this.errors;
  }

  @action.bound
  setMessage(message: string) {
    this.message = message;
  }

  @action.bound
  getMessage() {
    return this.message;
  }

  private errorsObservers = new Set<Function>();

  private runErrorsObserver() {
    this.errorsObservers.forEach((func) => func());
  }

  observeErrors = (callback: Function) => {
    this.errorsObservers.add(callback);
    return () => {
      this.errorsObservers.delete(callback);
    };
  };
}
