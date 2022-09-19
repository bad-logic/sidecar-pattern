import { faker } from "@faker-js/faker";

export default function generateUserInfo() {
  return {
    Id: faker.random.numeric(7),
    FirstName: faker.name.firstName(),
    MiddleName: faker.name.middleName(),
    LastName: faker.name.lastName(),
    Phone: faker.phone.number("+977-9##-###-####"),
    CreatedAt: faker.date.past().toISOString(),
  };
}
