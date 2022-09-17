import express from "express";
import { faker } from "@faker-js/faker";

function generateUserInfo() {
  return `
  <id>${faker.random.numeric(7)}</id>
  <firstName>${faker.name.firstName()}</firstName>
  <middleName>${faker.name.middleName()}</middleName>
  <lastName>${faker.name.lastName()}</lastName>
  <phone>${faker.phone.number("+977-9##-###-####")}</phone>
  <createdAt>${faker.date.past()}</createdAt>
  `;
}

const routeHandler = express();

routeHandler.use((req, res, next) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<users>`;
  for (let i = 0; i < 99; i++) {
    xml += `<customer>${generateUserInfo()}</customer>`;
  }
  xml += `</users>`;
  res.header("Content-Type", "application/xml");
  res.status(200).send(xml);
});

export default routeHandler;
