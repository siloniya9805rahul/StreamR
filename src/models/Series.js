// models/Series.js
import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema({
  title: { type: String, required: true,unique:true },
  genre: { type: String, required: true },
  movieIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
},
  { timestamps: true });

export default mongoose.models.Series || mongoose.model("Series", SeriesSchema);
