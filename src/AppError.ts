import { action, makeObservable, observable } from "mobx";

export type AppErrorValue = string | undefined;

export class AppError {
  static isAppError(value: any): value is AppError {
    return value instanceof AppError;
  }

  constructor() {
    makeObservable(this);
  }

  @observable
  message = "";

  @observable
  errors: Record<string, AppErrorValue> = {};

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

  hasErrors() {
    return Object.keys(this.errors).length !== 0;
  }

  hasAnyError() {
    return this.hasErrors() || this.message !== "";
  }

  getError(errorName: string) {
    return this.errors[errorName];
  }

  @action.bound
  setMessage(message: string) {
    this.message = message;
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
