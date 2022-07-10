const express = require('express');
const router = express.Router();
const authors = require("../controller/authorController")
const blogs = require("../controller/blogController")
const middleware = require("../middleware/middleware")



// AUTHOR CREATE
router.post("/authors", authors.createAuthor)

// LOGIN AUTHOR
router.post("/login", authors.loginAuthor)

// BLOG CONTROLLER
router.post("/blogs",middleware.authentication,middleware.authCreateBlog, blogs.createBlog)

// GET BLOG
router.get("/blogs", middleware.authentication, blogs.getBlog)

// UPDATE BLOG
router.put("/blogs/:blogId", middleware.authentication, middleware. authUpdateDelete, blogs.updateBlog)

// DELETE BLOG
router.delete("/deleteBlog/:blogId", middleware.authentication,middleware. authUpdateDelete, blogs.deleteBlog)

// DELETE BLOG BY PARAMS
router.delete("/blogs", middleware.authentication,middleware.authDeleteByParams, blogs.deleteBlogsQueryParams)




module.exports = router;