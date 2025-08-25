import mongoose, { Schema } from "mongoose";

const MovieSchema = new Schema(
  {
    movieName: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
    },
    poster: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    trailer: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    video: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

export default mongoose.models.Movie || mongoose.model("Movie", MovieSchema);
