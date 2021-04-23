import axios, { AxiosError, AxiosRequestConfig } from "axios";
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
    error: AppRequestError;
    config: AxiosRequestConfig;
    shareData: Record<string, any>;
  }) => AppRequestError | Promise<AppRequestError | null> | null)[] = [];

  private static async applyAllBeforeRequestMiddleware(config: AxiosRequestConfig) {
    for (let i = 0; i < RequestManager.beforeRequestMiddleware.length; i++) {
      const middleware = RequestManager.beforeRequestMiddleware[i];
      await middleware({ config });
    }
  }

  private static async applyAllBeforeErrorMiddleware(error: AppRequestError, config: AxiosRequestConfig) {
    const shareData: Record<string, any> = {};
    for (let i = 0; i < RequestManager.beforeErrorMiddleware.length; i++) {
      const middleware = RequestManager.beforeErrorMiddleware[i];
      const middlewareResult = await middleware({ error, config, shareData });
      if (!middlewareResult) break;

      error = middlewareResult;
    }

    return error;
  }

  private static async makeRequest({
    url,
    method,
    requestConfig,
    requestData: { options = {}, urlParams, additionalQueryParams, body },
  }: Required<Pick<CreateRequest<any>, "url" | "method" | "requestConfig">> & {
    requestData: RequestData;
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

    if (additionalQueryParams) {
      requestData.params = additionalQueryParams;
    }

    if (options.progressReceiver) {
      requestData.onUploadProgress = function ({ loaded, total }) {
        options.progressReceiver!(loaded / total);
      };
    }

    try {
      await RequestManager.applyAllBeforeRequestMiddleware(requestData);
      const { data } = await axios(requestData);
      return [{ requestData, response: data }, null] as const;
    } catch (axiosError) {
      return [
        null,
        { requestData, axiosError } as { requestData: AxiosRequestConfig; axiosError: AxiosError },
      ] as const;
    }
  }

  private static async applyError(
    error: AppRequestError,
    axiosRequestConfig: AxiosRequestConfig,
    requestData: RequestData = {},
  ) {
    if (requestData.options?.disableBeforeErrorMiddlewares) return error;
    return await RequestManager.applyAllBeforeErrorMiddleware(error, axiosRequestConfig);
  }

  createRequest<DecoderValue>({
    url,
    method = METHODS.GET,
    requestConfig = {},
    serverDataDecoder,
  }: CreateRequest<DecoderValue>) {
    return async function (requestData: RequestData = {}): Promise<DecoderValue> {
      const [requestResult, requestError] = await RequestManager.makeRequest({
        url,
        method,
        requestConfig,
        requestData,
      });

      if (requestError)
        throw await RequestManager.applyError(
          AppRequestError.buildFromAxiosError(requestError.axiosError),
          requestError.requestData,
          requestData,
        );

      if (!requestResult || !serverDataDecoder) return null!;

      const [data, decoderError] = serverDataDecoder
        .decodeAny(requestResult.response)
        .cata<[DecoderValue, string | null]>({
          Ok: (val) => [val, null],
          Err: (err) => [null!, err],
        });

      if (!decoderError) return data;
      throw await RequestManager.applyError(
        new AppRequestError({ message: `Response parsing error: ${decoderError}`, errors: {} }, -1),
        requestResult.requestData,
        requestData,
      );
    };
  }
}

RequestManager.beforeErrorMiddleware.push(({ error }) => error);

type CreateRequest<DecoderGenericType> = {
  url: string;
  method?: METHODS;
  serverDataDecoder?: Decoder<DecoderGenericType>;
  requestConfig?: {
    contentType?: string;
  };
};

export interface RequestOptions {
  disableBeforeErrorMiddlewares?: boolean;
  progressReceiver?: (progress: number) => void;
}

interface RequestData {
  body?: any;
  additionalQueryParams?: Record<string, string | number>;
  options?: RequestOptions;
  urlParams?: Record<string, string | number>;
}
