import mongoose from "mongoose";
import dotenv from "dotenv";
import { Faker } from "@faker-js/faker";
import { Users } from "../modules/users/User";
import { Article } from "../modules/articles/Article";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const faker = new Faker();

//generate users
const generateRandomUser = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = `fake${faker.random.number()}@fake.com`;

  return {
    email,
    password: "12345",
    firstName,
    lastName,
    active: true,
    profilePicture: faker.image.avatar(),
    story: faker.lorem.paragraph(),
  };
};
