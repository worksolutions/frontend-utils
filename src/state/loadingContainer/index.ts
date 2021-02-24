import { Service } from "typedi";
import { makeAutoObservable } from "mobx";

type ErrorInterface = Record<string, string | null>;

@Service({ transient: true })
export class LoadingContainer {
  loading!: boolean;
  errors: ErrorInterface = {};

  constructor(loading = false) {
    makeAutoObservable(this, { promisifyLibState: false });
    this.loading = loading;
  }

  private promisifyStateSuccess = (arg: any) => {
    this.stopLoading();
    return arg;
  };

  startLoading = () => {
    this.loading = true;
  };

  stopLoading = () => {
    this.loading = false;
  };

  promisifyLibState = {
    stateStart: this.startLoading,
    stateSuccess: this.promisifyStateSuccess,
    stateError: this.stopLoading,
  };

  setError = (name: string, value: string | null) => {
    this.errors[name] = value;
    this.runErrorsObserver();
  };

  getError = (name: string) => this.errors[name];

  setDefaultError = (message: string) => {
    this.setError("defaultMessage", message);
  };

  getDefaultError = () => this.getError("defaultMessage");

  setErrors = (errors: ErrorInterface) => {
    this.errors = errors || {};
    if (!this.hasErrors()) return;
    this.runErrorsObserver();
  };

  clearErrors = () => {
    this.errors = {};
  };

  getAnyError = () => {
    const defaultError = this.getDefaultError();
    if (defaultError) return defaultError;
    const errorKeys = Object.keys(this.errors);
    const unknownError = "Неизвестный формат ошибки";
    if (errorKeys.length === 0) return unknownError;
    return this.errors[errorKeys[0]] || unknownError;
  };

  hasErrors = () => Object.keys(this.errors).length !== 0;

  hasAnyError = () => this.hasErrors() || !!this.getDefaultError();

  private errorsObservers = new Set<Function>();

  private runErrorsObserver() {
    this.errorsObservers.forEach((func) => func());
  }

  observeErrors = (callback: () => void) => {
    this.errorsObservers.add(callback);
    return () => {
      this.errorsObservers.delete(callback);
    };
  };
}
