import { parseStringPromise } from "xml2js";

export const handleProxyResponse = () => (proxyRes, req, res) => {
  const body = [];
  proxyRes.on("data", (chunk) => {
    body.push(chunk);
  });
  proxyRes.on("end", async () => {
    try {
      const response = Buffer.concat(body).toString();
      const jsonResponse = await parseStringPromise(response, {
        trim: true,
        explicitArray: false,
      });
      res.writeHead(proxyRes.statusCode, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(jsonResponse));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Internal server error",
        })
      );
    }
  });
};
