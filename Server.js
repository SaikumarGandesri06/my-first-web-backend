require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Contact = require("./models/Contact");
const Note = require("./models/Note");

const app = express();

app.use(cors());
app.use(express.json());


// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});


// SAVE CONTACT
app.post("/contacts", async (req, res) => {

  try {

    const newContact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    });

    await newContact.save();

    res.json({
      message: "Contact Saved",
      data: newContact
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      message: "Error Saving Contact"
    });

  }

});


// SAVE NOTE
app.post("/notes", async (req, res) => {

  try {

    const newNote = new Note({
      text: req.body.text
    });

    await newNote.save();

    res.json({
      message: "Note Saved",
      data: newNote
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      message: "Error Saving Note"
    });

  }

});
app.get("/contacts", async (req, res) => {

  try {

    const contacts = await Contact.find();

    res.json(contacts);

  } catch(error) {

    console.log(error);

    res.status(500).json({
      message: "Error Fetching Contacts"
    });

  }

});
// UPDATE CONTACT
app.put("/contacts/:id", async (req, res) => {

  try {

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedContact);

  } catch(error) {

    console.log(error);

    res.status(500).json({
      message: "Error Updating Contact"
    });

  }

});
// DELETE CONTACT
app.delete("/contacts/:id", async (req, res) => {

  try {

    await Contact.findByIdAndDelete(req.params.id);

    res.json({
      message: "Contact Deleted"
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      message: "Error Deleting Contact"
    });

  }

});
app.post("/notes", async (req, res) => {

  try {

    const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    });

    await newNote.save();

    res.json(newNote);

  } catch(error) {

    console.log(error);

  }

});
// SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});