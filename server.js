require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// MODELS
const Contact = require("./models/Contact");
const Note = require("./models/Note");
const FamilyMember = require("./models/FamilyMember");

// CLOUDINARY + MULTER
const { upload } = require("./cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// DATABASE CONNECTION
// ─────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


  // HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});


// ─────────────────────────────────────────
// ADMIN SETUP (only one admin)
// ─────────────────────────────────────────
const ADMIN = {
  username: "saikumar",
  password: bcrypt.hashSync("gandesri2024", 10)
};

// ─────────────────────────────────────────
// MIDDLEWARE - Verify Admin Token
// ─────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ─────────────────────────────────────────
// TEST ROUTE
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("✅ Backend is Running!");
});

// ─────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== ADMIN.username || !bcrypt.compareSync(password, ADMIN.password)) {
    return res.status(401).json({ message: "Wrong username or password" });
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// ─────────────────────────────────────────
// CONTACTS ROUTES
// ─────────────────────────────────────────
// Get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

// Add contact
app.post("/contacts", async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    });
    await newContact.save();
    res.json({ message: "Contact Saved", data: newContact });
  } catch (error) {
    res.status(500).json({ message: "Error saving contact" });
  }
});

// Update contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating contact" });
  }
});

// Delete contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting contact" });
  }
});

// ─────────────────────────────────────────
// NOTES ROUTES
// ─────────────────────────────────────────
// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes" });
  }
});

// Add note
app.post("/notes", async (req, res) => {
  try {
    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });
    await newNote.save();
    res.json({ message: "Note Saved", data: newNote });
  } catch (error) {
    res.status(500).json({ message: "Error saving note" });
  }
});

// Update note
app.put("/notes/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating note" });
  }
});

// Delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note" });
  }
});

// ─────────────────────────────────────────
// FAMILY MEMBERS ROUTES
// ─────────────────────────────────────────
// Get all family members (public)
app.get("/family", async (req, res) => {
  try {
    const members = await FamilyMember.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching family members" });
  }
});

// Get single family member (public)
app.get("/family/:id", async (req, res) => {
  try {
    const member = await FamilyMember.findById(req.params.id);
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Error fetching member" });
  }
});

// Add family member (admin only)
app.post("/family", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const newMember = new FamilyMember({
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      familyTree: req.body.familyTree,
      image: req.file ? req.file.path : ""
    });
    await newMember.save();
    res.json({ message: "Member Added", data: newMember });
  } catch (error) {
    res.status(500).json({ message: "Error adding member" });
  }
});

// Update family member (admin only)
app.put("/family/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      familyTree: req.body.familyTree,
    };
    if (req.file) updateData.image = req.file.path;
    const updated = await FamilyMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating member" });
  }
});
// UPLOAD IMAGE (admin only)
app.post("/upload", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// Delete family member (admin only)
app.delete("/family/:id", verifyToken, async (req, res) => {
  try {
    await FamilyMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Member Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting member" });
  }
});
// SAVE FAMILY TREE
app.put("/family/:id/tree", verifyToken, async (req, res) => {
  try {
    const updated = await FamilyMember.findByIdAndUpdate(
      req.params.id,
      {
        treeNodes: req.body.treeNodes,
        treeConnections: req.body.treeConnections
      },
      { new: true }
    );
    res.json({ message: "Tree saved", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error saving tree" });
  }
});
const Vignesh = require("./models/Vignesh");

// GET VIGNESH DATA
app.get("/vignesh", async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    if (!data) {
      data = await Vignesh.create({ name: "Vignesh" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

// UPDATE VIGNESH PROFILE (admin)
app.put("/vignesh/profile", verifyToken, upload.single("profilePhoto"), async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    if (!data) data = new Vignesh({});
    if (req.body.name) data.name = req.body.name;
    if (req.body.tagline) data.tagline = req.body.tagline;
    if (req.body.dob) data.dob = req.body.dob;
    if (req.file) data.profilePhoto = req.file.path;
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// ADD PHOTO (admin)
app.post("/vignesh/photos", verifyToken, upload.single("image"), async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    if (!data) data = new Vignesh({});
    data.photos.push({
      url: req.file.path,
      caption: req.body.caption || ""
    });
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error adding photo" });
  }
});

// DELETE PHOTO (admin)
app.delete("/vignesh/photos/:photoId", verifyToken, async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    data.photos = data.photos.filter(p => p._id.toString() !== req.params.photoId);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting photo" });
  }
});

// ADD MESSAGE (anyone)
app.post("/vignesh/messages", async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    if (!data) data = new Vignesh({});
    data.messages.push({
      name: req.body.name,
      message: req.body.message
    });
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error adding message" });
  }
});

// DELETE MESSAGE (admin)
app.delete("/vignesh/messages/:msgId", verifyToken, async (req, res) => {
  try {
    let data = await Vignesh.findOne();
    data.messages = data.messages.filter(m => m._id.toString() !== req.params.msgId);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting message" });
  }
});
// KEEP ALIVE - ping every 14 minutes
const https = require("https");
setInterval(() => {
  https.get("https://my-first-web-backend.onrender.com/", (res) => {
    console.log(`Keep alive ping: ${res.statusCode}`);
  }).on("error", (err) => {
    console.log("Ping error:", err.message);
  });
}, 14 * 60 * 1000);
// ─────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


