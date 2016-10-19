"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});


/* https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry */
/* https://github.com/GoogleCloudPlatform/fluent-plugin-google-cloud/blob/master/lib/fluent/plugin/out_google_cloud.rb */
/* Note, this is actually the contents of jsonPayload, so it can contain
   arbitrary fields! */
let Logger = class Logger {

  constructor(console, formatter = Logger.JSON) {
    this.console = console;
    this.formatter = formatter;

    Object.seal(this);
  }

  write(severity, message, context = {}) {
    const entry = {
      time: new Date(),
      message: typeof message === "object" ? JSON.stringify(message) : String(message),
      severity
    };

    this.console.log(this.formatter(Object.assign(entry, context)));
  }

  debug(message, httpRequest) {
    this.write("DEBUG", message, { httpRequest });
  }

  info(message, httpRequest) {
    this.write("INFO", message, { httpRequest });
  }

  notice(message, httpRequest) {
    this.write("NOTICE", message, { httpRequest });
  }

  warning(message, httpRequest) {
    this.write("WARNING", message, { httpRequest });
  }

  error(message, httpRequest) {
    this.write("ERROR", message, { httpRequest });
  }

  critical(message, httpRequest) {
    this.write("CRITICAL", message, { httpRequest });
  }
};
Logger.JSON = JSON.stringify;

Logger.PRETTY = entry => {
  const reset = "\x1b[0m";
  const bold = "\x1b[1m";

  const black = "\x1b[30m";
  const red = "\x1b[31m";
  const green = "\x1b[32m";
  const yellow = "\x1b[33m";
  // const blue = "\x1b[34m"

  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  };

  const styles = {
    DEBUG: black + bold,
    INFO: reset,
    NOTICE: green + bold,
    WARNING: yellow + bold,
    ERROR: red + bold,
    CRITICAL: red + bold,
    ALERT: red + bold,
    EMERGENCY: red + bold
  };

  const time = `[${entry.time.toLocaleString("en", dateOptions)}]`;

  let http = "";
  if (entry.httpRequest) {
    const { remoteIp, requestMethod, requestUrl, status, responseSize } = entry.httpRequest;
    http = `${remoteIp || "unknown"} - ${requestMethod.toUpperCase()} ${requestUrl} ${status} ${responseSize} - `;
  }

  return `${time} ${styles[entry.severity]}${http}${entry.message}${reset}`;
};

exports.default = Logger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2xvZ2dlci5qcyJdLCJuYW1lcyI6WyJMb2dnZXIiLCJjb25zdHJ1Y3RvciIsImNvbnNvbGUiLCJmb3JtYXR0ZXIiLCJKU09OIiwiT2JqZWN0Iiwic2VhbCIsIndyaXRlIiwic2V2ZXJpdHkiLCJtZXNzYWdlIiwiY29udGV4dCIsImVudHJ5IiwidGltZSIsIkRhdGUiLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJsb2ciLCJhc3NpZ24iLCJkZWJ1ZyIsImh0dHBSZXF1ZXN0IiwiaW5mbyIsIm5vdGljZSIsIndhcm5pbmciLCJlcnJvciIsImNyaXRpY2FsIiwiUFJFVFRZIiwicmVzZXQiLCJib2xkIiwiYmxhY2siLCJyZWQiLCJncmVlbiIsInllbGxvdyIsImRhdGVPcHRpb25zIiwieWVhciIsIm1vbnRoIiwiZGF5IiwiaG91ciIsIm1pbnV0ZSIsInNlY29uZCIsImhvdXIxMiIsInN0eWxlcyIsIkRFQlVHIiwiSU5GTyIsIk5PVElDRSIsIldBUk5JTkciLCJFUlJPUiIsIkNSSVRJQ0FMIiwiQUxFUlQiLCJFTUVSR0VOQ1kiLCJ0b0xvY2FsZVN0cmluZyIsImh0dHAiLCJyZW1vdGVJcCIsInJlcXVlc3RNZXRob2QiLCJyZXF1ZXN0VXJsIiwic3RhdHVzIiwicmVzcG9uc2VTaXplIiwidG9VcHBlckNhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFzQkE7QUFDQTtBQUNBOztJQWFxQkEsTSxHQUFOLE1BQU1BLE1BQU4sQ0FBYTs7QUFnRDFCQyxjQUFZQyxPQUFaLEVBQXNDQyxZQUFnQ0gsT0FBT0ksSUFBN0UsRUFBbUY7QUFDakYsU0FBS0YsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7O0FBRUFFLFdBQU9DLElBQVAsQ0FBWSxJQUFaO0FBQ0Q7O0FBRURDLFFBQU1DLFFBQU4sRUFBNkJDLE9BQTdCLEVBQTZDQyxVQUFzQixFQUFuRSxFQUF1RTtBQUNyRSxVQUFNQyxRQUFrQjtBQUN0QkMsWUFBTSxJQUFJ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RTBDLElBQUssR0FBRXZDLE1BQU1GLE9BQVEsR0FBRWlCLEtBQU0sRUFBeEU7QUFDRCxDOztrQkE5Q2tCMUIsTSIsImZpbGUiOiJsb2dnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuZXhwb3J0IHR5cGUgSHR0cFJlcXVlc3QgPSB7XG4gIHJlcXVlc3RNZXRob2Q6IHN0cmluZyxcbiAgcmVxdWVzdFVybDogc3RyaW5nLFxuICByZXF1ZXN0U2l6ZTogbnVtYmVyLFxuICBzdGF0dXM6IG51bWJlcixcbiAgcmVzcG9uc2VTaXplOiBudW1iZXIsXG4gIHVzZXJBZ2VudD86IHN0cmluZyxcbiAgcmVtb3RlSXA/OiBzdHJpbmcsXG4gIHJlZmVyZXI/OiBzdHJpbmcsXG4gIGNhY2hlSGl0PzogYm9vbGVhbixcbiAgY2FjaGVWYWxpZGF0ZWRXaXRoT3JpZ2luU2VydmVyPzogYm9vbGVhbixcbn1cblxuZXhwb3J0IHR5cGUgUmVwb3J0TG9jYXRpb24gPSB7XG4gIGZpbGVQYXRoPzogc3RyaW5nLFxuICBsaW5lTnVtYmVyPzogbnVtYmVyLFxuICBmdW5jdGlvbk5hbWU/OiBzdHJpbmcsXG59XG5cbmV4cG9ydCB0eXBlIExvZ1NldmVyaXR5ID0gXCJERUJVR1wiIHwgXCJJTkZPXCIgfCBcIk5PVElDRVwiIHwgXCJXQVJOSU5HXCIgfCBcIkVSUk9SXCIgfCBcIkNSSVRJQ0FMXCIgfCBcIkFMRVJUXCIgfCBcIkVNRVJHRU5DWVwiXG5cbi8qIGh0dHBzOi8vY2xvdWQuZ29vZ2xlLmNvbS9sb2dnaW5nL2RvY3MvcmVmZXJlbmNlL3YyL3Jlc3QvdjIvTG9nRW50cnkgKi9cbi8qIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDbG91ZFBsYXRmb3JtL2ZsdWVudC1wbHVnaW4tZ29vZ2xlLWNsb3VkL2Jsb2IvbWFzdGVyL2xpYi9mbHVlbnQvcGx1Z2luL291dF9nb29nbGVfY2xvdWQucmIgKi9cbi8qIE5vdGUsIHRoaXMgaXMgYWN0dWFsbHkgdGhlIGNvbnRlbnRzIG9mIGpzb25QYXlsb2FkLCBzbyBpdCBjYW4gY29udGFpblxuICAgYXJiaXRyYXJ5IGZpZWxkcyEgKi9cbmV4cG9ydCB0eXBlIExvZ0VudHJ5ID0ge1xuICB0aW1lOiBEYXRlLFxuICBtZXNzYWdlOiBzdHJpbmcsXG4gIHNldmVyaXR5OiBMb2dTZXZlcml0eSxcbiAgaHR0cFJlcXVlc3Q/OiBIdHRwUmVxdWVzdCxcbn1cblxudHlwZSBMb2dDb250ZXh0ID0ge1xuICBodHRwUmVxdWVzdD86IEh0dHBSZXF1ZXN0LFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dnZXIge1xuICBjb25zb2xlOiBjb25zb2xlLkNvbnNvbGVcbiAgZm9ybWF0dGVyOiBPYmplY3QgPT4gc3RyaW5nXG5cbiAgc3RhdGljIEpTT04gPSBKU09OLnN0cmluZ2lmeVxuXG4gIHN0YXRpYyBQUkVUVFkgPSAoZW50cnk6IExvZ0VudHJ5KSA9PiB7XG4gICAgY29uc3QgcmVzZXQgPSBcIlxceDFiWzBtXCJcbiAgICBjb25zdCBib2xkID0gXCJcXHgxYlsxbVwiXG5cbiAgICBjb25zdCBibGFjayA9IFwiXFx4MWJbMzBtXCJcbiAgICBjb25zdCByZWQgPSBcIlxceDFiWzMxbVwiXG4gICAgY29uc3QgZ3JlZW4gPSBcIlxceDFiWzMybVwiXG4gICAgY29uc3QgeWVsbG93ID0gXCJcXHgxYlszM21cIlxuICAgIC8vIGNvbnN0IGJsdWUgPSBcIlxceDFiWzM0bVwiXG5cbiAgICBjb25zdCBkYXRlT3B0aW9ucyA9IHtcbiAgICAgIHllYXI6IFwibnVtZXJpY1wiLFxuICAgICAgbW9udGg6IFwic2hvcnRcIixcbiAgICAgIGRheTogXCJudW1lcmljXCIsXG4gICAgICBob3VyOiBcIjItZGlnaXRcIixcbiAgICAgIG1pbnV0ZTogXCIyLWRpZ2l0XCIsXG4gICAgICBzZWNvbmQ6IFwiMi1kaWdpdFwiLFxuICAgICAgaG91cjEyOiBmYWxzZSxcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZXMgPSB7XG4gICAgICBERUJVRzogYmxhY2sgKyBib2xkLFxuICAgICAgSU5GTzogcmVzZXQsXG4gICAgICBOT1RJQ0U6IGdyZWVuICsgYm9sZCxcbiAgICAgIFdBUk5JTkc6IHllbGxvdyArIGJvbGQsXG4gICAgICBFUlJPUjogcmVkICsgYm9sZCxcbiAgICAgIENSSVRJQ0FMOiByZWQgKyBib2xkLFxuICAgICAgQUxFUlQ6IHJlZCArIGJvbGQsXG4gICAgICBFTUVSR0VOQ1k6IHJlZCArIGJvbGQsXG4gICAgfVxuXG4gICAgY29uc3QgdGltZSA9IGBbJHtlbnRyeS50aW1lLnRvTG9jYWxlU3RyaW5nKFwiZW5cIiwgZGF0ZU9wdGlvbnMpfV1gXG5cbiAgICBsZXQgaHR0cCA9IFwiXCJcbiAgICBpZiAoZW50cnkuaHR0cFJlcXVlc3QpIHtcbiAgICAgIGNvbnN0IHtyZW1vdGVJcCwgcmVxdWVzdE1ldGhvZCwgcmVxdWVzdFVybCwgc3RhdHVzLCByZXNwb25zZVNpemV9ID0gZW50cnkuaHR0cFJlcXVlc3RcbiAgICAgIGh0dHAgPSBgJHtyZW1vdGVJcCB8fCBcInVua25vd25cIn0gLSAke3JlcXVlc3RNZXRob2QudG9VcHBlckNhc2UoKX0gJHtyZXF1ZXN0VXJsfSAke3N0YXR1c30gJHtyZXNwb25zZVNpemV9IC0gYFxuICAgIH1cblxuICAgIHJldHVybiBgJHt0aW1lfSAke3N0eWxlc1tlbnRyeS5zZXZlcml0eV19JHtodHRwfSR7ZW50cnkubWVzc2FnZX0ke3Jlc2V0fWBcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGNvbnNvbGU6IGNvbnNvbGUuQ29uc29sZSwgZm9ybWF0dGVyOiBMb2dFbnRyeSA9PiBzdHJpbmcgPSBMb2dnZXIuSlNPTikge1xuICAgIHRoaXMuY29uc29sZSA9IGNvbnNvbGVcbiAgICB0aGlzLmZvcm1hdHRlciA9IGZvcm1hdHRlclxuXG4gICAgT2JqZWN0LnNlYWwodGhpcylcbiAgfVxuXG4gIHdyaXRlKHNldmVyaXR5OiBMb2dTZXZlcml0eSwgbWVzc2FnZTogbWl4ZWQsIGNvbnRleHQ6IExvZ0NvbnRleHQgPSB7fSkge1xuICAgIGNvbnN0IGVudHJ5OiBMb2dFbnRyeSA9IHtcbiAgICAgIHRpbWU6IG5ldyBEYXRlLFxuICAgICAgbWVzc2FnZTogdHlwZW9mIG1lc3NhZ2UgPT09IFwib2JqZWN0XCIgPyBKU09OLnN0cmluZ2lmeShtZXNzYWdlKSA6IFN0cmluZyhtZXNzYWdlKSxcbiAgICAgIHNldmVyaXR5LFxuICAgIH1cblxuICAgIHRoaXMuY29uc29sZS5sb2codGhpcy5mb3JtYXR0ZXIoT2JqZWN0LmFzc2lnbihlbnRyeSwgY29udGV4dCkpKVxuICB9XG5cbiAgZGVidWcobWVzc2FnZTogbWl4ZWQsIGh0dHBSZXF1ZXN0OiBIdHRwUmVxdWVzdCB8IHZvaWQpIHtcbiAgICB0aGlzLndyaXRlKFwiREVCVUdcIiwgbWVzc2FnZSwge2h0dHBSZXF1ZXN0fSlcbiAgfVxuXG4gIGluZm8obWVzc2FnZTogbWl4ZWQsIGh0dHBSZXF1ZXN0OiBIdHRwUmVxdWVzdCB8IHZvaWQpIHtcbiAgICB0aGlzLndyaXRlKFwiSU5GT1wiLCBtZXNzYWdlLCB7aHR0cFJlcXVlc3R9KVxuICB9XG5cbiAgbm90aWNlKG1lc3NhZ2U6IG1peGVkLCBodHRwUmVxdWVzdDogSHR0cFJlcXVlc3QgfCB2b2lkKSB7XG4gICAgdGhpcy53cml0ZShcIk5PVElDRVwiLCBtZXNzYWdlLCB7aHR0cFJlcXVlc3R9KVxuICB9XG5cbiAgd2FybmluZyhtZXNzYWdlOiBtaXhlZCwgaHR0cFJlcXVlc3Q6IEh0dHBSZXF1ZXN0IHwgdm9pZCkge1xuICAgIHRoaXMud3JpdGUoXCJXQVJOSU5HXCIsIG1lc3NhZ2UsIHtodHRwUmVxdWVzdH0pXG4gIH1cblxuICBlcnJvcihtZXNzYWdlOiBtaXhlZCwgaHR0cFJlcXVlc3Q6IEh0dHBSZXF1ZXN0IHwgdm9pZCkge1xuICAgIHRoaXMud3JpdGUoXCJFUlJPUlwiLCBtZXNzYWdlLCB7aHR0cFJlcXVlc3R9KVxuICB9XG5cbiAgY3JpdGljYWwobWVzc2FnZTogbWl4ZWQsIGh0dHBSZXF1ZXN0OiBIdHRwUmVxdWVzdCB8IHZvaWQpIHtcbiAgICB0aGlzLndyaXRlKFwiQ1JJVElDQUxcIiwgbWVzc2FnZSwge2h0dHBSZXF1ZXN0fSlcbiAgfVxufVxuIl19