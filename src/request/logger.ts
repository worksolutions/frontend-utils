export function errorLogger(requestData: object, error: string) {
  console.log("---------------------------");
  console.log("Error when parsing response");
  console.log("Request info", requestData);
  console.log("Original error:");
  console.log(error);
  console.log();
  console.log("Parsed error:");
  try {
    error.split("I found an error").forEach((val) => {
      const ofIndex = val.indexOf("of");
      if (ofIndex === -1) {
        console.log(val);
        return;
      }
      const startObjectPosition = ofIndex + 2;
      const endObjectPosition = val.lastIndexOf("}") + 1;
      console.log(val.slice(0, startObjectPosition), ": ");
      console.log(JSON.parse(val.slice(startObjectPosition, endObjectPosition)));
      console.log(val.slice(endObjectPosition));
    });
  } catch (err) {
    console.log("exception when error parsing:", err);
  }
  console.log("---------------------------\n\n\n");
}
