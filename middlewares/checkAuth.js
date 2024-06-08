import { getToken } from "../service/authenticate.js";

export const checkAuthentication = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log("Provide token");
    return res.redirect("/user/login");
    
  }

  try {
    const user = getToken(token);
    if (!user) {
      throw new Error("Invalid token");
    }
    req.user = user;
    next();
  } catch (error) {

    return res.redirect("/user/login");
  }
};
export const authValid = (req, res, next) => {
  const token = req.cookies.token;

  try {
    const user = getToken(token);
    req.user = user;
  } catch (error) {
    req.user = null;
    res.redirect("/user/login");
  }

  next();
};
