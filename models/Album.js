const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: "" },
  addedBy: { type: String, default: "Admin" },
  createdAt: { type: Date, default: Date.now }
});

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AlbumSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: { type: String, default: "" },
  dob: { type: String, default: "" },
  profilePhoto: { type: String, default: "" },
  coverColor: { type: String, default: "#6366f1" },
  photos: [PhotoSchema],
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Album", AlbumSchema);