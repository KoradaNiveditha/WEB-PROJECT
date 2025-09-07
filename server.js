const express = require("express"); 
const session = require("express-session"); 
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 
const multer = require("multer"); 
const path = require("path"); 
const fs = require("fs"); 
 
const User = require("./models/User"); 
const Blog = require("./models/Blog"); 
 
const app = express(); 
const PORT = 3000; 
app.use(express.static("js"));  // expose js folder

 
// Connect to MongoDB Atlas 
mongoose.connect(
  "mongodb+srv://niveditha:niveditha04@cluster0.tq9jnve.mongodb.net/finalWebDB?retryWrites=true&w=majority")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));
  
//  Middleware 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use(session({ secret: "secret", resave: false, saveUninitialized: true })); 
app.use(express.static("public")); 
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // for serving images 
 
//  Setup multer for file uploads 
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    const uploadPath = path.join(__dirname, "uploads"); 
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath); 
    cb(null, uploadPath); 
  }, 
 
  filename: (req, file, cb) => { 
    const uniqueName = `${Date.now()}-${file.originalname}`; 
    cb(null, uniqueName); 
  }, 
}); 
 
const upload = multer({ storage }); 
 
//  Dashboard Access 
app.get("/dashboard.html", (req, res, next) => { 
  if (!req.session.username) return res.redirect("login.html"); 
  next(); 
}); 
 
//  Sign up 
app.post("/signup", async (req, res) => { 
  const { username, password } = req.body; 
  const userExists = await User.findOne({ username }); 
  if (userExists) return res.send("User already exists. <a href='signup.html'>Try again</a>"); 
  await User.create({ username, password }); 
  res.redirect("login.html"); 
}); 
 
//  Login 
app.post("/login", async (req, res) => { 
  const { username, password } = req.body; 
  const user = await User.findOne({ username }); 
  if (!user || user.password !== password) 
    return res.send("Invalid credentials. <a href='login.html'>Try again</a>"); 
  req.session.username = username; 
  res.redirect("dashboard.html"); 
}); 
 
//  Logout 
app.get("/logout", (req, res) => { 
  req.session.destroy(() => res.redirect("login.html")); 
}); 
 
//  Create Post (with image upload) 
app.post("/post", upload.single("image"), async (req, res) => { 
  const username = req.session.username; 
  if (!username) return res.status(401).send("Login required"); 
 
  const { title, content } = req.body; 
  const image = req.file ? `/uploads/${req.file.filename}` : null; 
 
  await Blog.create({ title, content, image, author: username, date: new Date() }); 
  res.redirect("dashboard.html"); 
});  
 
//  Fetch All Blogs 
app.get("/blogs", async (req, res) => { 
  const blogs = await Blog.find().sort({ date: -1 }); 
  res.json({ blogs, currentUser: req.session.username || null }); 
}); 
 
//  Edit Post 
app.post("/edit-post", async (req, res) => { 
  const { id, title, content } = req.body; 
  const blog = await Blog.findById(id); 
  if (!blog || blog.author !== req.session.username) 
    return res.status(403).send("Unauthorized"); 
 
  blog.title = title; 
  blog.content = content; 
  blog.date = new Date(); 
  await blog.save(); 
  res.sendStatus(200); 
}); 
 
//  Delete Post 
app.post("/delete-post", async (req, res) => { 
  const { id } = req.body; 
  const blog = await Blog.findById(id); 
  if (!blog || blog.author !== req.session.username) 
    return res.status(403).send("Unauthorized"); 
 
  // Also remove uploaded image file if exists 
  if (blog.image) { 
    const imgPath = path.join(__dirname, blog.image); 
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); 
  } 
 
  await Blog.findByIdAndDelete(id); 
  res.sendStatus(200); 
}); 
 
// Profile Data 
app.get("/profile-data", async (req, res) => { 
  const username = req.session.username; 
  if (!username) return res.status(401).send("Unauthorized"); 
 
  const totalPosts = await Blog.countDocuments({ author: username }); 
  const recentPosts = await Blog.find({ author: username }).sort({ date: -1 }).limit(5); 
 
  res.json({ username, totalPosts, recentPosts }); 
}); 
 
//  Start Server 
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)); 