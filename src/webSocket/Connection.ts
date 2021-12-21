import Decoder from "jsonous/Decoder";
import { array } from "jsonous";

import { AppWebSocketError } from "./AppWebSocketError";
import { ConnectionInterface, ConnectionStatus } from "./index";

export class Connection implements ConnectionInterface {
  constructor({
    onHandler,
    emitHandler,
    getStatusHandler,
  }: {
    onHandler: (eventName: string, callback: (...args: any[]) => void) => any;
    emitHandler: (eventName: string, ...args: any[]) => any;
    getStatusHandler: () => ConnectionStatus;
  }) {
    this.__on = onHandler;
    this.__emit = emitHandler;
    this.getStatus = getStatusHandler;
  }

  private readonly __on: (eventName: string, callback: (...args: any[]) => void) => any;

  private readonly __emit: (eventName: string, ...args: any[]) => any;

  applyError!: (error: AppWebSocketError) => Promise<AppWebSocketError>;

  on<MessageDecoderValue>(
    eventName: string,
    callback: (...messages: MessageDecoderValue[]) => void,
    serverMessageDecoder?: Decoder<MessageDecoderValue>,
  ) {
    const eventHandler = async (...serverMessages: any) => {
      if (!serverMessageDecoder) {
        callback(...serverMessages);
        return;
      }

      const [data, decoderError] = array(serverMessageDecoder)
        .decodeAny(serverMessages)
        .cata<[MessageDecoderValue[], string | null]>({
          Ok: (val) => [val, null],
          Err: (err) => [null!, err],
        });

      if (!decoderError) {
        callback(...data);
        return;
      }

      throw await this.applyError(
        new AppWebSocketError({ message: `Message parsing error: ${decoderError}`, errors: {} }),
      );
    };

    this.__on(eventName, (...args: any) => eventHandler(...args).catch(console.error));
  }

  emit(eventName: string, ...args: any[]) {
    this.__emit(eventName, ...args);
  }

  getStatus!: () => ConnectionStatus;
}
