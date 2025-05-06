import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect('mongodb+srv://hr4617:2462@cluster0.1tol9.mongodb.net/food-del')
    .then(() => console.log("DB Connected"))
    .catch((error) => {
      console.error("DB Connection Error:", error);
      process.exit(1);
    });
};
