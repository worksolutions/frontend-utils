import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { isNil } from "ramda";
import Decoder from "jsonous";
import { Service } from "typedi";

import { AppRequestError } from "./AppRequestError";
import { template } from "../template";

export enum METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

@Service({ global: true })
export class RequestManager {
  static baseURL = "";

  static beforeRequestMiddleware: ((data: { config: AxiosRequestConfig }) => void | Promise<void>)[] = [];

  static beforeErrorMiddleware: ((data: {
    nativeError: AxiosError;
    config: AxiosRequestConfig;
    shareData: Record<string, any>;
    previousAppRequestError: AppRequestError;
  }) => AppRequestError | Promise<AppRequestError>)[] = [];

  private static async applyAllBeforeRequestMiddleware(config: AxiosRequestConfig) {
    for (let i = 0; i < RequestManager.beforeRequestMiddleware.length; i++) {
      const middleware = RequestManager.beforeRequestMiddleware[i];
      await middleware({ config });
    }
  }

  private static async applyAllBeforeErrorMiddleware(nativeError: AxiosError, config: AxiosRequestConfig) {
    const shareData: Record<string, any> = {};
    let result: AppRequestError | Promise<AppRequestError> = null!;

    for (let i = 0; i < RequestManager.beforeErrorMiddleware.length; i++) {
      const middleware = RequestManager.beforeErrorMiddleware[i];
      result = await middleware({ nativeError, config, shareData, previousAppRequestError: result });
    }

    return result;
  }

  private static async makeAndDecodeRequest({
    url,
    method,
    requestConfig,
    requestOptions: { options = {}, urlParams, body },
  }: Required<Pick<CreateRequest<any>, "url" | "method" | "requestConfig">> & {
    requestOptions: RequestOptions;
  }) {
    const requestData: AxiosRequestConfig = {
      url,
      method,
      baseURL: RequestManager.baseURL,
      headers: { accept: "application/json" },
    };

    if (requestConfig.contentType) {
      requestData.headers["content-type"] = requestConfig.contentType;
    }

    requestData[method === METHODS.GET ? "params" : "data"] = body;

    if (urlParams) {
      requestData.url = template(requestData.url!, urlParams);
    }

    if (options.progressReceiver) {
      requestData.onUploadProgress = function ({ loaded, total }) {
        options.progressReceiver!(loaded / total);
      };
    }

    try {
      await RequestManager.applyAllBeforeRequestMiddleware(requestData);
      const { data } = await axios(requestData);
      return [data, null];
    } catch (axiosError) {
      return [null, await RequestManager.applyAllBeforeErrorMiddleware(axiosError, requestData)];
    }
  }

  createRequest<DecoderValue>({
    url,
    method = METHODS.GET,
    requestConfig = {},
    serverDataDecoder,
  }: CreateRequest<DecoderValue>) {
    return async function (requestOptions: RequestOptions = {}): Promise<DecoderValue> {
      const [result, error] = await RequestManager.makeAndDecodeRequest({
        url,
        method,
        requestConfig,
        requestOptions,
      });
      if (error) throw error;
      if (!result || !serverDataDecoder) return null!;
      const [data, decoderError] = serverDataDecoder.decodeAny(result).cata<[DecoderValue, any]>({
        Ok: (val) => [val, null],
        Err: (err) => [null!, err],
      });
      if (!decoderError) return data;
      throw new AppRequestError({ message: `Response parsing error: ${decoderError}`, errors: {} }, -1);
    };
  }
}

RequestManager.beforeErrorMiddleware.push(
  ({ nativeError }) =>
    new AppRequestError(
      { message: nativeError.message, errors: {} },
      isNil(nativeError.code) ? -1 : parseFloat(nativeError.code),
      nativeError,
    ),
);

type CreateRequest<DecoderGenericType> = {
  url: string;
  method?: METHODS;
  serverDataDecoder?: Decoder<DecoderGenericType>;
  requestConfig?: {
    contentType?: string;
  };
};

interface RequestOptions {
  body?: any;
  options?: {
    progressReceiver?: (progress: number) => void;
  };
  urlParams?: { [name: string]: string | number };
}
