import { Builder } from "xml2js";

export default function convertJsonResponseToXml() {
  return (req, res, next) => {
    const sendCopy = res.send;
    res.send = function () {
      res.set("Content-Type", "application/xml");
      arguments[0] = new Builder().buildObject(arguments[0]);
      sendCopy.apply(res, arguments);
    };
    next();
  };
}
