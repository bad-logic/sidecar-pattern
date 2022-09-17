import express from "express";
import convertJsonResponseToXml from "./middlewares/convertResponseToXML.js";
import generateUserInfo from "./utils/generateFakeData.js";

const routeHandler = express();

routeHandler.use(convertJsonResponseToXml());

routeHandler.use((req, res, next) => {
  const customers = [];
  for (let i = 0; i < 99; i++) {
    customers.push({ customer: generateUserInfo() });
  }
  const usersInfo = {
    customers,
  };
  res.status(200).send(usersInfo);
});

export default routeHandler;
