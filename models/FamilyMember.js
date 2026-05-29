const mongoose = require("mongoose");

const FamilyMemberSchema = new mongoose.Schema({
  name: String,
  type: String, // "brother" or "sister"
  description: String,
  image: String, // Cloudinary URL
  photos: [String], // array of Cloudinary URLs for gallery
  familyTree: String // text description of family tree
});

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema);