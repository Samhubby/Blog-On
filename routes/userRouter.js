import { Router } from "express";
import { User } from "../models/userModel.js";
import { createToken } from "../service/authenticate.js";
import multer, { diskStorage } from "multer";
import path from "path";

export const router = Router();

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/profile"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", upload.single("profile"), async (req, res) => {
  const { fullName, email, password } = req.body;
  const profilePhoto = req.file ? `/profile/${req.file.filename}` : null;
  const user = await User.create({
    fullName,
    email,
    password,
    profilePhoto
  });
  const token = createToken(user);
  if (!token) {
    return res.redirect("/user/login");
  }
  return res.cookie("token", token).redirect("/");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(
      email,
      password
    );
    if (!token) {
      return res.redirect("/user/login");
    }
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render('login', { error: 'Incorrect email or password' });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});
