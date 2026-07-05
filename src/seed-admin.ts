import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "./models/user.model";
import { MONGODB_URI } from "./config";

async function seedAdmin() {
  try {
    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: "admin@motoparts.com" });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@motoparts.com");
      console.log("Password: admin123");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new UserModel({
      name: "Admin User",
      email: "admin@motoparts.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@motoparts.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
