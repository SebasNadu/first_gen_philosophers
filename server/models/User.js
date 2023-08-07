import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exists"],
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 5,
      maxLength: 20,
      select: false,
    },
    firstName: { type: String },
    lastName: { type: String },
    active: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    story: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Hashing password before saving
userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    throw new Error("Error hashing password");
  }
});

// Compare password
userSchema.methods.comparePassword = async (password, userPassword) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

const User = mongoose.model("User", userSchema);

export default User;
