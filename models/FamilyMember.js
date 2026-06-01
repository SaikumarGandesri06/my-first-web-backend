const mongoose = require("mongoose");

const TreeNodeSchema = new mongoose.Schema({
  nodeId: String,
  name: String,
  age: Number,
  dob: String,
  relationship: String,
  photo: String,
  x: Number,
  y: Number
});

const ConnectionSchema = new mongoose.Schema({
  from: String,
  to: String
});

const FamilyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["brother", "sister"] },
  description: { type: String },
  image: { type: String },
  photos: [{ type: String }],
  familyTree: { type: String },
  dob: { type: String },
  age: { type: Number },
  treeNodes: [TreeNodeSchema],        // ← stores all nodes
  treeConnections: [ConnectionSchema], // ← stores all connections
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FamilyMember", FamilyMemberSchema);
