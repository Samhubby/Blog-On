import express, { urlencoded } from "express";
import "dotenv/config.js";
import path from "path";
import { connectDB } from "./connection/connectDB.js";
import { router } from "./routes/userRouter.js";
import { authValid } from "./middlewares/checkAuth.js";
import cookieParser from "cookie-parser";
import { blogRouter } from "./routes/blogRouter.js";
import { Blog } from "./models/blogModel.js";

const app = express();
const PORT = process.env.PORT;

//MIDDLEWARES
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));

//Home Page
app.get("/",authValid, (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.get("/blog", authValid,async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("blog", {
    user: req.user,
    allBlogs,
  });
});

//DBCONNECTION
connectDB()
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.log(error);
  });

//ROUTES
app.use("/user", router);
app.use("/blogs", blogRouter);

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
