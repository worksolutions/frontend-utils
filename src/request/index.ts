import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from "axios";
import { isNil } from "ramda";
import Decoder from "jsonous";
import { Service } from "typedi";

import { BaseError } from "../BaseError";

import { errorLogger } from "./logger";

export interface RequestConfigInterface {
  contentType?: string;
}

export interface OptionsInterface {
  urlParams?: { [name: string]: string | number };
  cancelName?: string;
  cancelToken?: CancelTokenSource;
  progressReceiver?: (progress: number) => void;
}

export interface RequestOptions {
  body?: any;
  options?: OptionsInterface;
}

type RequestCancelledType = "request_cancelled";

export const REQUEST_CANCELLED: RequestCancelledType = "request_cancelled";

export enum METHODS {
  POST = "post",
  GET = "get",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export class RequestError extends BaseError {
  static isRequestError(data: any): data is RequestError {
    return data instanceof RequestError;
  }

  constructor(error: typeof BaseError.prototype.error, public statusCode = 0, public axiosError: AxiosError = null!) {
    super(error);
  }
}

type RequestData = AxiosRequestConfig & { url: string };

@Service({ global: true })
export class RequestManager {
  static makeCancelToken() {
    return axios.CancelToken.source();
  }

  static baseURL = "";
  static loggerEnabled = false;

  static cancellations: { [name: string]: CancelTokenSource } = {};

  static beforeSendMiddleware: ((config: RequestData) => void)[] = [];
  static beforeErrorMiddleware: ((config: RequestData, error: AxiosError) => void)[] = [];

  private static applyAllBeforeSendMiddleware(requestContext: RequestData) {
    RequestManager.beforeSendMiddleware.forEach((func) => {
      func(requestContext);
    });
  }

  private static applyAllErrorMiddleware(requestContext: RequestData, error: AxiosError) {
    RequestManager.beforeErrorMiddleware.forEach((func) => {
      func(requestContext, error);
    });
  }

  // eslint-disable-next-line max-params,complexity
  private static async makeAndDecodeResponse(
    url: string,
    method: METHODS,
    body: any,
    requestOptions: OptionsInterface,
    requestConfig: RequestConfigInterface,
  ) {
    const { urlParams, cancelName, cancelToken, progressReceiver } = requestOptions;
    const { contentType } = requestConfig;

    const requestData: RequestData = {
      url,
      baseURL: RequestManager.baseURL,
      method,
    };

    if (cancelName) {
      const cancelForRequest = RequestManager.cancellations[cancelName];
      if (cancelForRequest) cancelForRequest.cancel(REQUEST_CANCELLED);
      RequestManager.cancellations[cancelName] = axios.CancelToken.source();
      requestData.cancelToken = RequestManager.cancellations[cancelName].token;
    } else if (cancelToken) {
      requestData.cancelToken = cancelToken.token;
    }

    requestData.headers = { accept: "application/json" };

    if (contentType) {
      requestData.headers = {
        ...requestData.headers,
        "content-type": contentType,
      };
    }

    requestData[method === METHODS.GET ? "params" : "data"] = body;

    if (urlParams) {
      for (const i in urlParams) {
        if (isNil(urlParams[i]))
          return [
            null,
            new RequestError(
              {
                message: `Ошибка передачи параметра '${i}'`,
                errors: {},
              },
              -1,
              null!,
            ),
          ];

        requestData.url = requestData.url.replace(`{${i}}`, urlParams[i].toString());
      }
    }

    if (progressReceiver) {
      requestData.onUploadProgress = function ({ loaded, total }) {
        progressReceiver(loaded / total);
      };
    }

    RequestManager.applyAllBeforeSendMiddleware(requestData);

    try {
      const { data } = await axios(requestData);

      if (cancelName && RequestManager.cancellations[cancelName]) {
        RequestManager.cancellations[cancelName] = undefined!;
      }

      return [data, null];
    } catch (_originalAxiosError) {
      const axiosError: AxiosError = _originalAxiosError;
      if (axiosError.message === REQUEST_CANCELLED)
        return [null, new RequestError({ message: REQUEST_CANCELLED, errors: {} }, -1, axiosError)];

      RequestManager.applyAllErrorMiddleware(requestData, _originalAxiosError);

      if (!axiosError.response)
        return [null, new RequestError({ message: "Запрос сброшен", errors: {} }, -1, axiosError)];

      const { response } = axiosError;
      if (!response.data)
        return [
          null,
          new RequestError({ message: "Не удалось получить ошибку", errors: {} }, response.status, axiosError),
        ];

      return [
        null,
        new RequestError(
          {
            message: response.data.message,
            errors: response.data.errors,
          },
          response.status,
          axiosError,
        ),
      ];
    }
  }

  private static errorLogger(requestData: object, error: any) {
    if (!RequestManager.loggerEnabled) return;
    errorLogger(requestData, error);
  }

  // eslint-disable-next-line max-params
  static async makeRequest<T>(
    url: string,
    method: METHODS,
    body: any,
    options: OptionsInterface,
    requestConfig: RequestConfigInterface,
    serverDataDecoder?: Decoder<T>,
  ): Promise<T> {
    const [result, error] = await RequestManager.makeAndDecodeResponse(url, method, body, options, requestConfig);

    if (error) throw error;

    if (!serverDataDecoder) return null!;

    if (!result) return null!;

    const [data, decoderError] = serverDataDecoder.decodeAny(result).cata<[T, any]>({
      Ok: (val) => [val, null],
      Err: (err) => [null!, err],
    });

    if (decoderError) {
      RequestManager.errorLogger({ url, method, body, options }, decoderError);
      throw new RequestError(
        {
          message: `Не удалось произвести парсинг ответа: ${decoderError}`,
          errors: {},
        },
        0,
      );
    }

    return data;
  }

  makeCancelName(url: string, method: METHODS) {
    return `${method} ${url}`;
  }

  // eslint-disable-next-line max-params
  createRequest<DecoderGenericType>(
    url: string,
    method: METHODS,
    serverDataDecoder?: Decoder<DecoderGenericType>,
    requestConfig: RequestConfigInterface = {},
  ) {
    return function (requestOptions: RequestOptions = {}): Promise<DecoderGenericType> {
      return RequestManager.makeRequest(
        url,
        method,
        requestOptions.body,
        requestOptions.options || {},
        requestConfig,
        serverDataDecoder,
      ).catch((error: RequestError) => {
        RequestManager.errorLogger(error, null);
        throw error;
      });
    };
  }
}
