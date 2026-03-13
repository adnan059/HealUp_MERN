import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

import User from "../models/userModel";
import { Doctor } from "../models/doctorModel";
import DoctorSchedule from "../models/doctorScheduleModel";

dotenv.config();

const DB_URL = process.env.DB_URL as string;

if (!DB_URL) {
  throw new Error("DB_URL Not Found");
}

const specialties: Array<
  | "cardiology"
  | "rheumatology"
  | "neurology"
  | "pediatrics"
  | "endocrinology"
  | "dermatology"
  | "nephrology"
  | "orthopedics"
  | "oncology"
> = [
  "cardiology",
  "rheumatology",
  "neurology",
  "pediatrics",
  "endocrinology",
  "dermatology",
  "nephrology",
  "orthopedics",
  "oncology",
];

const generateDoctorUsers = async (count: number) => {
  const hashedPassword = await bcrypt.hash("doctor123", 10);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (let i = 0; i < count; i++) {
      // 1️⃣ Create User
      const [user] = await User.create(
        [
          {
            name: faker.person.fullName(),
            email: `doctor${i}_${Date.now()}@demo.com`,
            password: hashedPassword,
            avatar: faker.image.avatar(),
            roles: ["patient", "doctor"],
          },
        ],
        { session },
      );

      // 2️⃣ Create Doctor
      const [doctor] = await Doctor.create(
        [
          {
            userId: user._id,
            specialty: faker.helpers.arrayElement(specialties),
            degree: faker.helpers.arrayElement([
              "MBBS",
              "MBBS, MD",
              "MBBS, FCPS",
              "MBBS, MS",
            ]),
            experience: faker.number.int({ min: 3, max: 8 }),
            about: faker.lorem.paragraphs(2),
            fees: faker.number.int({ min: 1000, max: 2000 }),
            address: faker.location.streetAddress(),
            isApproved: false,
          },
        ],
        { session },
      );

      // 3️⃣ Create Doctor Schedule
      await DoctorSchedule.create(
        [
          {
            doctorId: doctor._id,
            workingDays: faker.helpers
              .arrayElements([0, 1, 2, 3, 4, 5, 6], {
                min: 2,
                max: 6,
              })
              .sort((a, b) => a - b),
            slotDuration: faker.helpers.arrayElement([20, 30]),
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();

    process.exit(0);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    session.endSession();
  }
};

const seed = async () => {
  await mongoose.connect(DB_URL);

  const count = Number(process.argv[2]) || 10;

  await generateDoctorUsers(count);
};

seed();
