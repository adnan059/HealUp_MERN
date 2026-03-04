import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

import dotenv from "dotenv";

import User from "../models/userModel";

dotenv.config();

const DB_URL = process.env.DB_URL as string;

if (!DB_URL) {
  throw new Error("DB_URL Not Found");
}

const generateUsers = async (count: number) => {
  const users = [];
  const hashedPassword = await bcrypt.hash("user123", 10);

  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: hashedPassword,
      role: ["patient"],
      avatar: faker.image.avatar(),
    });
  }

  return users;
};

const seedUsers = async () => {
  try {
    await mongoose.connect(DB_URL);
    const users = await generateUsers(10);
    await User.insertMany(users, { ordered: false });
    process.exit(0);
  } catch (error) {
    console.log("seeding error: ", error);
    process.exit(1);
  }
};

seedUsers();
