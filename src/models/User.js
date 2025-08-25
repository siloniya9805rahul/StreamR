import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // <--- this means username must be sent
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  lastLogin: {
    type: Date, // track when user last logged in
    default: null,
  },
  avatar: {
    url: { type: String, default: "/avatar.jpg" },
    public_id: { type: String },
  },
},
  { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
