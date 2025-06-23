import mongoose from "mongoose";

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: String,
  email: { type: String, required: true, unique: true }, // enforce unique emails
});

// Export Model
export const UserModel = mongoose.model("User", userSchema);
