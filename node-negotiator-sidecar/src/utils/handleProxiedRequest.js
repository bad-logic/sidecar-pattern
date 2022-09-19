export const handleProxyRequest = () => (proxyReq, clientReq, clientRes) => {
  // remove .json or .xml if exists for content negotiation
  const newPath = clientReq.url.split(".").shift();
  proxyReq.path = newPath;
};
