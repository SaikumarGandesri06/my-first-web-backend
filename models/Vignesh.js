const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PhotoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const VigneshSchema = new mongoose.Schema({
  name: { type: String, default: "Vignesh" },
  tagline: { type: String, default: "" },
  dob: { type: String, default: "" },
  profilePhoto: { type: String, default: "" },
  photos: [PhotoSchema],
  messages: [MessageSchema]
});

module.exports = mongoose.model("Vignesh", VigneshSchema);