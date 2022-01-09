export function asyncPipe<RESULT>(...func: ((prevResult: RESULT) => RESULT | Promise<RESULT>)[]) {
  return async function (data: RESULT) {
    for (let i = 0; i < func.length; i++) data = await func[i](data);
    return data;
  };
}
