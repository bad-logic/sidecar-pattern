export const gracefulShutdown = (server) => {
  // close http server
  if (server) {
    server.close(() => {
      console.warn("Http Server stopped!!!");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
