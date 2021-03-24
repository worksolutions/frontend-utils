import { Service } from "typedi";
import { makeAutoObservable } from "mobx";

import { AppError } from "../../AppError";

@Service({ transient: true })
export class LoadingContainer {
  loading!: boolean;
  error!: AppError;

  constructor(loading = false) {
    this.loading = loading;
    this.error = new AppError();
    makeAutoObservable(this, { promisifyLibState: false });
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
}
