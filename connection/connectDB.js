import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://samayaasylumml:m7LKGXDj1bCnVCCd@blog.rb0rnv9.mongodb.net/New-Blog?retryWrites=true&w=majority&appName=Blog"
  );
};
