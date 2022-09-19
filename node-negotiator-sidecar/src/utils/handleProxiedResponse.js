import { parseStringPromise } from "xml2js";

function responseWithXmlData(url) {
  const separateWithDot = url.split(".");
  const extension = separateWithDot.pop();
  let respond = false;
  if (extension === "xml") {
    respond = true;
  }
  return respond;
}

export const handleProxyResponse = () => (proxyRes, clientReq, clientRes) => {
  const body = [];
  proxyRes.on("data", (chunk) => {
    body.push(chunk);
  });
  proxyRes.on("end", async () => {
    try {
      let response = Buffer.concat(body).toString();
      if (responseWithXmlData(clientReq.url)) {
        clientRes.writeHead(proxyRes.statusCode, {
          "Content-Type": "application/xml",
        });
      } else {
        clientRes.writeHead(proxyRes.statusCode, {
          "Content-Type": "application/json",
        });
        response = await parseStringPromise(response, {
          trim: true,
          explicitArray: false,
        });
        response = JSON.stringify(response);
      }
      clientRes.end(response);
    } catch (err) {
      console.error(err);
      clientRes.writeHead(500, { "Content-Type": "application/json" });
      clientRes.end(
        JSON.stringify({
          message: "Internal server error",
        })
      );
    }
  });
};
