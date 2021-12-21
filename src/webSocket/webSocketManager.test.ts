import { field, number, string, succeed } from "jsonous";

import { fieldOrDefaultDecoder, toInstance, toInstanceDecoder } from "../decoders";

import { WebSocketManager, ConnectionStatus, Connection } from "./index";

async function createConnection(url: string) {
  return Promise.resolve({
    status: "Connected" as const,
    on: (eventName: string, callback: (...args: any[]) => void) =>
      setTimeout(() => callback({ count: 1 }, { count: 2 }, { count: 3, text: eventName }), 1000),
    send: (eventName: string, ...args: any[]) => undefined,
  });
}

const connectionStatusMap = {
  Connected: ConnectionStatus.CONNECTED,
};

WebSocketManager.baseURL = "ws:/test-host";

WebSocketManager.internalSocketManager = {
  connect: async ({ baseURL, url }) => {
    const connection = await createConnection(baseURL + url);

    expect(baseURL + url).toBe("ws:/test-host/hub-address-1");

    return new Connection({
      onHandler: connection.on,
      emitHandler: connection.send,
      getStatusHandler: () => connectionStatusMap[connection.status],
    });
  },
};

const webSocketManager = new WebSocketManager();
const createTestConnection = webSocketManager.createConnection({ url: "/hub-address-{id}" });

class MessageEntity {
  count!: number;

  text?: string;
}

test("webSocketManager message decoding", (done) => {
  createTestConnection({ urlParams: { id: 1 } }).then((connection) => {
    connection.on<MessageEntity>(
      "event",
      (...messages) => {
        expect(messages).not.toStrictEqual([
          { count: 1, text: undefined },
          { count: 2, text: undefined },
          { count: 3, text: "event" },
        ]);

        expect(messages).toStrictEqual([
          toInstance(MessageEntity)({ count: 1, text: undefined }),
          toInstance(MessageEntity)({ count: 2, text: undefined }),
          toInstance(MessageEntity)({ count: 3, text: "event" }),
        ]);
        done();
      },
      succeed({})
        .assign("count", field("count", number))
        .assign("text", fieldOrDefaultDecoder("text", string, undefined))
        .andThen(toInstanceDecoder(MessageEntity)),
    );
  });
});

test("webSocketManager status", () => {
  createTestConnection({ urlParams: { id: 1 } }).then((connection) => {
    expect(connection.getStatus()).toBe(ConnectionStatus.CONNECTED);
  });
});
