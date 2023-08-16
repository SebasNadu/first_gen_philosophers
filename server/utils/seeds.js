import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "../modules/users/User.js";
import Article from "../modules/articles/Article.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

//generate users
const generateRandomUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = `test${faker.number.int(500)}@test.com`;

  return {
    email,
    password: "12345",
    firstName,
    lastName,
    active: true,
    profilePicture: faker.image.avatar(),
    story: faker.person.bio(),
  };
};

// generate articles
const generateRandomArticle = (userId) => {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(3),
    tags: [faker.lorem.word(), faker.lorem.word()],
    picture: faker.image.urlLoremFlickr(),
    active: true,
    user: userId,
  };
};

// const test = async () => {
//   try {
//     const user = await User.create(generateRandomUser());
//     const article = await Article.create(generateRandomArticle(user.id));
//   } catch (error) {
//     console.log(error);
//   } finally {
//     mongoose.connection.close();
//   }
// };
//
// test();

// seed database
const seedDatabase = async () => {
  try {
    // creating 10 users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = await User.create(generateRandomUser());
      users.push(user);
    }

    // creating 2 articles for each user
    for (const user of users) {
      for (let i = 0; i < 2; i++) {
        await Article.create(generateRandomArticle(user._id));
      }
    }

    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // closing connection
    mongoose.connection.close();
  }
};

// Ejecutar el proceso de seeding
seedDatabase();
