const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  image: String, // <-- Add this line
  date: Date,
});

module.exports = mongoose.model("Blog", blogSchema);
