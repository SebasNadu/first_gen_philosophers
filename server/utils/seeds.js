import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import User from "../modules/users/User.js";
import Article from "../modules/articles/Article.js";
import Comment from "../modules/comments/Comment.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

//generate users
const generateRandomUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = `user${faker.number.int(999)}@firstgen.com`;

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
const generateRandomArticle = (user) => {
  return {
    title: faker.word.words(5),
    abstract: faker.word.words({ count: { min: 25, max: 50 } }),
    body: faker.lorem.sentences({ min: 10, max: 50 }),
    tags: [faker.word.sample(), faker.word.sample(), faker.word.sample()],
    picture: faker.image.urlPicsumPhotos(),
    active: true,
    user,
  };
};

// generate comments
const generateRandomComment = (user, article) => {
  return {
    content: faker.word.words({ count: { min: 10, max: 50 } }),
    user,
    article,
  };
};

const seedDatabase = async () => {
  try {
    // deleting all data
    await User.deleteMany();
    await Article.deleteMany();
    await Comment.deleteMany();
    console.log("data deleted");

    // creating 10 users
    const users = [];
    for (let i = 0; i < 25; i++) {
      const user = await User.create(generateRandomUser());
      users.push(user);
      await user.save();
      console.log("user created");
    }

    // creating 1 articles for each user
    const articles = [];
    for (const user of users) {
      const article = await Article.create(generateRandomArticle(user));
      articles.push(article);
      await article.save();
      console.log("article created");
    }

    const comments = [];
    // creating comments, likes and followers
    for (const user of users) {
      const currentUser = await User.findById(user.id)
        .select("id followers following")
        .populate([
          {
            path: "followers",
            model: "User",
          },
          { path: "following", model: "User" },
        ]);
      currentUser.password = "12345";

      // creating 2 comments for random articles
      for (let i = 0; i < 2; i++) {
        const randomArt = articles[Math.floor(Math.random() * articles.length)];
        const randomArticle = await Article.findById(randomArt.id)
          .select("comments countComments")
          .populate({
            path: "comments",
            model: "Comment",
          });
        const comment = await Comment.create(
          generateRandomComment(currentUser, randomArticle)
        );
        randomArticle.countComments++;
        randomArticle.comments.push(comment);
        comments.push(comment);
        await comment.save();
        await randomArticle.save();
        console.log("comment created");
      }
      // creating 10 likes for random articles
      for (let i = 0; i < 10; i++) {
        const randomArt = articles[Math.floor(Math.random() * articles.length)];
        const randomArticle = await Article.findById(randomArt._id)
          .select("likes countLikes")
          .populate({
            path: "likes",
            model: "User",
          });
        randomArticle.countLikes++;
        randomArticle.likes.push(user);
        await randomArticle.save();
        console.log("like Article created");
      }

      // creating 10 followers for random users
      for (let i = 0; i < 10; i++) {
        const randomUserIndex = faker.number.int({
          min: 0,
          max: users.length - 2,
        });
        const userWithoutCurrentUser = users.filter(
          (user) => user.id !== currentUser.id
        );
        const userSelect = userWithoutCurrentUser[randomUserIndex];

        const randomUser = await User.findById(userSelect.id)
          .select("id followers following")
          .populate([
            { path: "followers", model: "User" },
            { path: "following", model: "User" },
          ]);
        randomUser.followers.push(currentUser.id);
        currentUser.following.push(randomUser.id);
        await randomUser.save();
        await currentUser.save();
        console.log("follower created");
      }

      // creating 10 likes for random comments
      for (let i = 0; i < 10; i++) {
        const randomCommentIndex = faker.number.int({
          min: 0,
          max: comments.length - 1,
        });
        const randomComment = await Comment.findById(
          comments[randomCommentIndex].id
        )
          .select("likes")
          .populate({ path: "likes", model: "User" });
        randomComment.likes.push(currentUser);
        await randomComment.save();
        console.log("like Comment created");
      }
      console.log("finish iteration with a user");
    }
    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // closing connection
    mongoose.connection.close();
  }
};

seedDatabase();
