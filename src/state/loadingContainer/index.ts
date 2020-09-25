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

  promisifyAPI = {
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
  }

  @action.bound
  clearErrors() {
    this.errors = {};
  }

  hasAnyError = () => Object.keys(this.errors).length !== 0;
}
