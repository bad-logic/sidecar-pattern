import express from "express";
import convertJsonResponseToXml from "./middlewares/convertResponseToXML.js";
import generateUserInfo from "./utils/generateFakeData.js";

const routeHandler = express();

routeHandler.use(convertJsonResponseToXml());

routeHandler.get("/node/customers", (req, res, next) => {
  const customers = [];
  for (let i = 0; i < 99; i++) {
    customers.push({ customer: generateUserInfo() });
  }
  const usersInfo = {
    customers,
  };
  res.status(200).send(usersInfo);
});

routeHandler.use((req, res, next) => {
  res.status(404).send({ Message: "NOT FOUND" });
});

export default routeHandler;
