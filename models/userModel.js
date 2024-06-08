import { Schema, model } from "mongoose";
import { randomBytes, createHash } from "crypto";
import { createToken } from "../service/authenticate.js";

const userModel = Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  salt: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: "/profile/avatardefault.png",
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
});

userModel.pre("save", function (next) {
  const user = this;
  const salt = randomBytes(16).toString();
  if (!user.isModified("password")) return false;
  const hashedPassword = createHash("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userModel.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    const hashedPassword = user.password;
    const salt = this.salt;
    if (!user) throw new Error("User not Found");
    const userPasswordHashed = createHash("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== userPasswordHashed) {
      throw new Error("Incorrect Password");
    }
    const token = createToken(user);
  
    return token;
  }
);

export const User = model("User", userModel, "user");
