import http from "http";
import routeHandler from "./app.js";

const server = http.createServer(routeHandler);

// set port to listen on the server
server.listen(process.env.PORT);

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
  console.info(`API server running on port ${process.env.PORT || 3000} ✔️`);
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
