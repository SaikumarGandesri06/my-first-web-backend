const mongoose = require("mongoose");

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["brother", "sister"] },
  description: { type: String },
  image: { type: String },
  photos: [{ type: String }],
  familyTree: { type: String },
  dob: { type: String },     // ← add this
  age: { type: Number },     // ← add this
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema);