import { Router } from "express";
import { Blog } from "../models/blogModel.js";
import multer, { diskStorage } from "multer";
import path from "path";
import { authValid, checkAuthentication } from "../middlewares/checkAuth.js";
import { Comment } from "../models/commentModel.js";

export const blogRouter = Router();
const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/cover"));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

blogRouter.get("/", (req, res) => {
  res.render("blogs");
});
blogRouter.get("/add-blogs", checkAuthentication, (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

blogRouter.post(
  "/add-blogs",
  checkAuthentication,
  upload.single("coverImage"),
  async (req, res) => {
    const { title, content } = req.body;
    try {
      const coverImage = req.file ? `/cover/${req.file.filename}` : null;
      await Blog.create({
        title,
        content,
        coverImage,
        createdBy: req.user.id,
      });

      return res.redirect("/blog");
    } catch (error) {
      console.log(error);
      res.redirect("/user/login");
    }
  }
);
blogRouter.post(
  "/comment/:id",
  checkAuthentication,
  authValid,
  async (req, res) => {
    const comment = req.body.comment;
    try {
      await Comment.create({
        comment,
        createdBy: req.user.id,
        blog: req.params.id,
      });
      res.redirect(`/blogs/allblogs/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  }
);

blogRouter.get("/allblogs/:id", authValid, async (req, res) => {
  const blogID = req.params.id;

  const blog = await Blog.findById(blogID).populate("createdBy");
  const comments = await Comment.find({ blog: blogID }).populate("createdBy");
  res.render("allblogs", {
    user: req.user,
    blog,
    comments,
  });
});
