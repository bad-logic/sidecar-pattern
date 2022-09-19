import http from "http";
import httpProxy from "http-proxy";
import Logger from "./utils/logger.js";
import { gracefulShutdown } from "./utils/graceful.js";
import { handleProxyRequest } from "./utils/handleProxiedRequest.js";
import { handleProxyResponse } from "./utils/handleProxiedResponse.js";

const {
  SRV_NAME = "NEGOTIATOR_SIDECAR",
  MAIN_PROCESS,
  MAIN_PROCESS_PORT,
  PORT = 8080,
} = process.env;

const logger = new Logger(SRV_NAME);
if (!MAIN_PROCESS && !MAIN_PROCESS_PORT) {
  console.error(
    "MAIN_PROCESS not found, sidecar cannot run without MAIN_PROCESS"
  );
  gracefulShutdown();
}

const apiProxy = httpProxy.createProxyServer();

apiProxy.on("proxyRes", handleProxyResponse());
apiProxy.on("proxyReq", handleProxyRequest());

const server = http.createServer((req, res) => {
  logger.send(MAIN_PROCESS, req.url, Date.now());
  apiProxy.web(req, res, {
    target: `http://${MAIN_PROCESS}:${MAIN_PROCESS_PORT}`,
    selfHandleResponse: true,
  });
});

server.listen(PORT);

// when server is 'listening' event is fired log some info
server.on("listening", () => {
  console.info(
    `sidecar for ${process.env.MAIN_PROCESS} running on port ${process.env.PORT} ✔️`
  );
});

// handling 'error' event fired by the server
server.on("error", (error) => {
  console.error(`Application Crashed  ${error?.stack?.split("\n")}`);
});

// handling termination signals

process.on("SIGTERM", () => {
  // user presses ctrl + C
  console.error("user presses ctrl + c");
  gracefulShutdown(server);
});

process.on("SIGINT", () => {
  // user presses ctrl + D
  console.error("user presses ctrl + d");
  gracefulShutdown(server);
});

// prevent promise rejection exits
process.on("unhandledRejection", (reason, promise) => {
  console.error("unhandledRejection", reason);
  throw reason;
});

// prevent dirty exit on code-fault crashes
process.on("uncaughtException", (error) => {
  console.error(`Application Crashed  ${error?.stack?.split("\n")}`);
  gracefulShutdown(server);
});
