import { Service } from "typedi";
import Decoder from "jsonous/Decoder";

import { AppWebSocketError } from "./AppWebSocketError";

import { template } from "../template";

export enum ConnectionStatus {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTING = "DISCONNECTING",
  RECONNECTING = "RECONNECTING",
}

export interface ConnectionInterface {
  emit: (eventName: string, ...args: any[]) => void;
  on: <MessageDecoderValue>(
    eventName: string,
    callback: (...args: MessageDecoderValue[]) => void,
    serverMessageDecoder?: Decoder<MessageDecoderValue>,
  ) => void;
  getStatus: () => ConnectionStatus;
  applyError: (error: AppWebSocketError) => Promise<AppWebSocketError>;
}

type CreateConnection = {
  url: string;
};

interface ConnectionData {
  urlParams?: Record<string, string | number>;
  options?: { disableBeforeErrorMiddlewares?: boolean; keysToDeleteBeforeErrorMiddleware?: string[] };
}

interface InternalSocketManagerInterface {
  connect: (config: InternalSocketManagerConnectionConfig) => Promise<ConnectionInterface>;
}

type InternalSocketManagerConnectionConfig = {
  url: string;
  baseURL: string;
};

type BeforeErrorMiddleware = (data: {
  error: AppWebSocketError;
  config: InternalSocketManagerConnectionConfig;
  shareData: Record<string, any>;
}) => AppWebSocketError | Promise<AppWebSocketError | null> | null;

@Service({ global: true })
export class WebSocketManager {
  private activeConnections: Record<string, ConnectionInterface> = {};

  static baseURL = "";

  static internalSocketManager: InternalSocketManagerInterface;

  private static beforeErrorMiddlewareMap: Record<string, BeforeErrorMiddleware> = {};

  static addBeforeErrorMiddleware(subscriptionKey: string, middleware: BeforeErrorMiddleware) {
    WebSocketManager.beforeErrorMiddlewareMap[subscriptionKey] = middleware;
  }

  static deleteBeforeErrorMiddleware(subscriptionKey: string) {
    delete WebSocketManager.beforeErrorMiddlewareMap[subscriptionKey];
  }

  private static async applyAllBeforeErrorMiddleware(
    error: AppWebSocketError,
    config: InternalSocketManagerConnectionConfig,
    keysToDeleteMiddleware: string[] = [],
  ) {
    const shareData: Record<string, any> = {};

    keysToDeleteMiddleware.forEach((key) => {
      WebSocketManager.deleteBeforeErrorMiddleware(key);
    });

    const beforeErrorMiddleware = Object.values(WebSocketManager.beforeErrorMiddlewareMap);

    for (let i = 0; i < beforeErrorMiddleware.length; i++) {
      const middleware = beforeErrorMiddleware[i];
      const middlewareResult = await middleware({ error, config, shareData });
      if (!middlewareResult) break;

      error = middlewareResult;
    }

    return error;
  }

  private static async applyError(
    error: AppWebSocketError,
    connectionConfig: InternalSocketManagerConnectionConfig,
    connectionData: ConnectionData = {},
  ) {
    if (connectionData.options?.disableBeforeErrorMiddlewares) return error;
    return await WebSocketManager.applyAllBeforeErrorMiddleware(
      error,
      connectionConfig,
      connectionData.options?.keysToDeleteBeforeErrorMiddleware,
    );
  }

  private static async makeConnect({
    url,
    connectionData: { urlParams },
  }: CreateConnection & {
    connectionData: ConnectionData;
  }) {
    const connectionData: InternalSocketManagerConnectionConfig = {
      url,
      baseURL: WebSocketManager.baseURL,
    };

    if (urlParams) {
      connectionData.url = template(connectionData.url!, urlParams);
    }

    try {
      const connection = await WebSocketManager.internalSocketManager.connect(connectionData);
      return [{ connectionData, connection }, null] as const;
    } catch (internalWebSocketError) {
      return [
        null,
        { connectionData, internalWebSocketError } as {
          connectionData: InternalSocketManagerConnectionConfig;
          internalWebSocketError: any;
        },
      ] as const;
    }
  }

  createConnection<DecoderValue>({ url }: CreateConnection) {
    return async (connectionData: ConnectionData = {}) => {
      const activeConnection = this.activeConnections[url];

      if (activeConnection && activeConnection.getStatus() === ConnectionStatus.CONNECTED) {
        return activeConnection;
      }

      delete this.activeConnections[url];

      const [connectionResult, connectionError] = await WebSocketManager.makeConnect({
        url,
        connectionData,
      });

      if (connectionError) {
        throw await WebSocketManager.applyError(
          AppWebSocketError.buildFromInternalWebSocketError(connectionError.internalWebSocketError),
          connectionError.connectionData,
          connectionData,
        );
      }

      if (!connectionResult) return null!;

      connectionResult.connection.applyError = async (error: AppWebSocketError) =>
        await WebSocketManager.applyError(error, connectionResult.connectionData, connectionData);

      this.activeConnections[url] = connectionResult.connection;
      return connectionResult.connection;
    };
  }
}

export { Connection } from "./Connection";
