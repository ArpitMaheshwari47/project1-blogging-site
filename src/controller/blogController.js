const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongoose').Types.ObjectId
const blogModel = require("../model/blogModel");
const authorModel = require("../model/authorModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}

const createBlog = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide All blog details" })
    }
    if (!isValid(data.title)) { return res.status(400).send({ status: false, msg: "Blog title is not Defined" }) }

    if (!isValid(data.body)) { return res.status(400).send({ status: false, msg: "Blog Body is not Defined" }) }

    // Objectid is a moongoose module/package that check if a enterd object id is valid or not.(Check the length)
    if (!ObjectId.isValid(data.authorId)) { // returns boolean. if not true than return invalid
      return res.status(400).send({ status: false, msg: "Bad Request. AuthorId invalid" })
    }

    if (!isValid(data.tags)) { return res.status(400).send({ status: false, msg: "Blog tags is not Defined" }) }

    if (!isValid(data.category)) { return res.status(400).send({ status: false, msg: "Blog category is not Defined" }) }


    const createAuthor = await authorModel.findById(data.authorId)

    if (!createAuthor) { return res.status(400).send({ status: false, msg: "Resource Not found. Please create an account" }) }

    const savedData = await blogModel.create(data)
    res.status(201).send({ status: true, data: savedData })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}



const getBlog = async function (req, res) {
  try {

    let data = req.query;
    let filter = {
      isDeleted: false,
      isPublished: true,
      ...data
    }

    const { authorId, category, tags, subcategory } = data
    if (category) {
      let verifyCategory = await blogModel.findOne({ category: category })
      if (!verifyCategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Category Exist" })
      }
    }
    if (tags) {
      let verifyTag = await blogModel.findOne({ tags: tags })
      if (!verifyTag) {
        return res.status(400).send({ status: false, msg: "No Blogs In This Tags Exist" })
      }
    }
    if (subcategory) {
      let verifySubcategory = await blogModel.findOne({ subcategory: subcategory })
      if (!verifySubcategory) {
        return res.status(400).send({ status: false, msg: "No Blogs In This SubCategory Exist" })
      }
    }

    if (!ObjectId.isValid(authorId)) {

      return res.status(400).send({ status: false, msg: "authorId is invalid" })

    }
    let getRecord = await blogModel.find(data).populate("authorId")

    if (getRecord.length == 0) {
      return res.status(404).send({
        status: false,
        data: "Resource Not found."
      })
    }
    return res.status(200).send({ status: true, msg: "All Data created", data: getRecord })

  }
  catch (err) {
    res.status(500).send({  msg:"Serverside Errors. Please try again later", error: err.message })
  }

}






const updateBlog = async function (req, res) {
  try {
    let data = req.body
    let BlogId = req.params.blogId;
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, msg: "Please provide blog details" })
    }

    let title = req.body.title
    let body = req.body.body
    let tags = req.body.tags
    let category = req.body.category
    let subcategory = req.body.subcategory
    let date1 = new Date()

    const updateBlog = await blogModel.findOneAndUpdate({ _id: BlogId, isDeleted: false },
      {
        $set: {
          title: title, body: body, tags: tags, category: category, subcategory: subcategory, isPublished: true,
          publishedAt: date1
        }
      }, { new: true }).populate("authorId");


    res.status(200).send({ status: true, data: updateBlog })

    const blogdata = updateBlog ?? "BLog not found"
    res.status(200).send({ status: true, data: "DAta is Deleted" })



  } catch (err) {
    res.status(500).send({ msg: err.name })
  }
}

// delete blogs ===================================================
const deleteBlog = async function (req, res) {
  try {
    let BlogId = req.params.blogId
    let date = new Date()
    let Blog = await blogModel.findById(BlogId)

    // WHEN WE PROVIDE WRONG ID
    if (!Blog) {
      return res.status(404).send({ status: false, msg: "BlogId Not Exist In DB" })
    }
    let check = await blogModel.findOneAndUpdate(
      { _id: BlogId },
      { $set: { isDeleted: true, deletedAt: date } },
      { new: true })

    //IF THE BLOG IS ALREADY DELETED  
    if (!check) {
      return res.status(404).send({ status: false, msg: "DAta DELETED" })
    }

    return res.status(200).send({ status: true, msg: "Blog successfully deleted" })
  }

  catch (error) {
    return res.status(500).send({ status: false, data: error.name })
  }
}


//deleteby params are not get understand

const deleteBlogsQueryParams = async function (req, res) {
  try {

    let data = req.qyery
    let authorId = data.authorId
    let data2 = new Date()
    const blogs = await blogModel.find({ ...data, isDeleted: false, authorId: authorId })

    if (blogs.length == 0) {
      return res.status(404).send({ status: false, msg: "Data  Already Deleted" })
    }
    const deleteBlog = await blogModel.updateMany({ _id: { $in: blogs } }, { $set: { isDeleted: true } })

    res.status(201).send({ status: true, msg:  "Blog successfully deleted", data: deleteBlog })
  }
  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }
}


module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.deleteBlog = deleteBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogsQueryParams = deleteBlogsQueryParams