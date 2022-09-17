import { faker } from "@faker-js/faker";

export default function generateUserInfo() {
  return {
    id: faker.random.numeric(7),
    firstName: faker.name.firstName(),
    middleName: faker.name.middleName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number("+977-9##-###-####"),
    createdAt: faker.date.past().toISOString(),
  };
}
