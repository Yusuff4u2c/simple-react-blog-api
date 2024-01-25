const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.APP_PORT;

const blogPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});
mongoose
  .connect(`${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`)
  .then(() => {
    app.listen(PORT, () => {
      console.log("app listening on port 8001");
    });
  })
  .catch((e) => {
    console.log(e);
  });

const Blogpost = mongoose.model("Blogpost", blogPostSchema);

app.get("/blogs", async (req, res) => {
  try {
    const blogPosts = await Blogpost.find({});
    res.json(blogPosts);
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!id || !isValidId) {
      return res.json({ status: false, message: "Invalid Id" });
    }
    const blogPost = await Blogpost.findById(id);
    if (!blogPost) {
      return res.json({ status: false, message: "post not found" });
    }
    res.json(blogPost);
  } catch (error) {
    console.log(error);
  }
});

app.post("/blogs", async (req, res) => {
  try {
    const body = req.body;
    const newBlogPost = new Blogpost(body);
    await newBlogPost.save();
    res.json({ message: "Added" });
  } catch (error) {
    console.log(error.message);
  }
});

app.put("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBlog = req.body;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!id || !isValidId) {
      return res.json({ status: false, message: "Invalid Id" });
    }
    const blog = await Blogpost.findById(id);
    if (!blog) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "blogpost not found" });
    }
    Object.assign(blog, updatedBlog);
    await blog.save();
    res
      .status(StatusCodes.OK)
      .json({ status: true, message: "blogpost updated" });
  } catch (error) {}
});

app.delete("/blogs/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!id || !isValidId) {
      return res.json({ status: false, message: "Invalid Id" });
    }
    const blogExist = await Blogpost.findById(id);
    if (!blogExist) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: false, message: "blogpost not found" });
    }
    await Blogpost.deleteOne({ _id: id });
    res
      .status(StatusCodes.OK)
      .json({ status: true, message: "blogpost deleted" });
  } catch (error) {
    console.log(error);
  }
});
