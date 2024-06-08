import jwt from "jsonwebtoken";
const SECRET = process.env.SECRET_KEY;
export const createToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      profile: user.profilePhoto,
    },
    SECRET
  );
  return token;
};

export const getToken = (token) => {
  try {
    const user = jwt.verify(token, SECRET);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};
