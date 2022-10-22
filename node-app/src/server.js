import http from "node:http";
import url from "node:url";
import routeHandler from "./app.js";

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  const server = http.createServer(routeHandler);

  const APP_PORT = process.env.PORT || 3000;

  // set port to listen on the server
  server.listen(APP_PORT);

  const gracefulShutdown = () => {
    // close http server
    server.close(() => {
      console.warn("Http Server stopped!!!");
      process.exit(1);
    });
  };

  function cleanup() {
    // close db connections
    // any other connections if exists
    gracefulShutdown();
  }

  // when server is 'listening' event is fired log some info
  server.on("listening", () => {
    console.info(`API server running on port ${APP_PORT} ✔️`);
  });

  // handling 'error' event fired by the server
  server.on("error", (error) => {
    console.error(`Application Crashed  ${error?.stack?.split("\n")}`);
  });

  // handling termination signals

  process.on("SIGTERM", () => {
    // user presses ctrl + C
    console.error("user presses ctrl + c");
    cleanup();
  });

  process.on("SIGINT", () => {
    // user presses ctrl + D
    console.error("user presses ctrl + d");
    cleanup();
  });

  // prevent promise rejection exits
  process.on("unhandledRejection", (reason, promise) => {
    console.error("unhandledRejection", reason);
    throw reason;
  });

  // prevent dirty exit on code-fault crashes
  process.on("uncaughtException", (error) => {
    console.error(`Application Crashed  ${error?.stack?.split("\n")}`);
    cleanup();
  });
}
