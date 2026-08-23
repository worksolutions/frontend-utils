import { waitFor } from "../waitFor";
import { asyncTimeout } from "../asyncTimeout";

test("resolves immediately when condition is already true", async function () {
  let calls = 0;
  await expect(
    waitFor(() => {
      calls++;
      return true;
    }),
  ).resolves.toBeUndefined();
  expect(calls).toBe(1);
});

test("resolves when condition becomes true later", async function () {
  let value = false;
  asyncTimeout(50).then(() => (value = true));
  await expect(waitFor(() => value, { checkIntervalMS: 10 })).resolves.toBeUndefined();
  expect(value).toBe(true);
});

test("supports async condition", async function () {
  let value = false;
  asyncTimeout(50).then(() => (value = true));
  await expect(waitFor(async () => value, { checkIntervalMS: 10 })).resolves.toBeUndefined();
});

test("rejects with Timeout", async function () {
  await expect(waitFor(() => false, { checkIntervalMS: 10, timeoutMS: 50 })).rejects.toThrow("Timeout");
});

test("rejects with condition error", async function () {
  await expect(waitFor(() => Promise.reject(new Error("boom")), { checkIntervalMS: 10 })).rejects.toThrow("boom");

  let first = true;
  await expect(
    waitFor(
      () => {
        if (first) {
          first = false;
          return false;
        }
        throw new Error("boom later");
      },
      { checkIntervalMS: 10 },
    ),
  ).rejects.toThrow("boom later");
});

test("rejects with Aborted when signal is already aborted", async function () {
  const controller = new AbortController();
  controller.abort();
  await expect(waitFor(() => true, { abortSignal: controller.signal })).rejects.toThrow("Aborted");
});

test("rejects with Aborted when signal aborts while waiting", async function () {
  const controller = new AbortController();
  asyncTimeout(50).then(() => controller.abort());
  await expect(waitFor(() => false, { abortSignal: controller.signal, checkIntervalMS: 10 })).rejects.toThrow(
    "Aborted",
  );
});

test("stops checking condition after abort", async function () {
  const controller = new AbortController();
  let calls = 0;
  const promise = waitFor(
    () => {
      calls++;
      return false;
    },
    { abortSignal: controller.signal, checkIntervalMS: 10 },
  );
  await asyncTimeout(50);
  controller.abort();
  await expect(promise).rejects.toThrow("Aborted");

  const callsAfterAbort = calls;
  await asyncTimeout(50);
  expect(calls).toBe(callsAfterAbort);
});
