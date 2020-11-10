import { Service } from "typedi";
import { action, observable } from "mobx";

type ErrorInterface = Record<string, string | null>;

@Service({ transient: true })
export class LoadingContainer {
  @observable loading!: boolean;
  @observable errors: ErrorInterface = {};

  constructor(loading = false) {
    this.loading = loading;
  }

  @action.bound
  private promisifyStateSuccess(arg: any) {
    this.stopLoading();
    return arg;
  }

  promisifyLibState = {
    stateStart: this.startLoading,
    stateSuccess: this.promisifyStateSuccess,
    stateError: this.stopLoading,
  };

  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action.bound
  startLoading() {
    this.loading = true;
  }

  @action.bound
  stopLoading() {
    this.loading = false;
  }

  @action.bound
  setError(name: string, value: string | null) {
    this.errors[name] = value;
    this.runErrorsObserver();
  }

  getError = (name: string) => this.errors[name];

  @action.bound
  setDefaultError(message: string) {
    this.setError("defaultMessage", message);
  }

  getDefaultError = () => this.getError("defaultMessage");

  @action.bound
  setErrors(errors: ErrorInterface) {
    this.errors = errors || {};
    if (!this.hasErrors()) return;
    this.runErrorsObserver();
  }

  @action.bound
  clearErrors() {
    this.errors = {};
  }

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
