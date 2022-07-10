const mongoose = require("mongoose")
const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken");


// make a function for validation for the fname,lname,title in the author

const isValid = function (value) {
  if (typeof value === "undefined" || value === Number || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}


// CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({status:false, msg: "Please provide blog details" })
    }

    // ALL THE EDGE CASES ARE HERE FOR THE CREATE AUTHOR

    if (!isValid(data.fname)) {
      return res.status(400).send({ status: false, msg: "please Enter fName(required field)" })
    }
    if (!isValid(data.lname)) {
      return res.status(400).send({ status: false, msg: "please Enter lName(required field)" })
    }
    if (!isValid(data.title)) {
      return res.status(400).send({ status: false, msg: "please Enter Title(required field)" })
    }


    // EMAIL DUPLICAY AND SYNTAX OF IT 

    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status: false, msg: "please Enter Valid Email" })
    }

    const isEmailPresent = await authorModel.findOne({ email: data.email })

    if (isEmailPresent) {
      return res.status(400).send({ status: false, msg: "EmailId Is Already Exist In DB" })
    }

    // password validation
    if (!data.password) {
      return res
        .status(400)
        .send({ status: false, msg: " Please enter password(required field)" });
    }

    // create author
    const savedData = await authorModel.create(data)
    return res.status(200).send({ data: savedData })
  }

  catch (err) {
    return res.status(500).send({ status: false, data: err.message })
  }

}

// LOGIN AUTHOR ==========================
const loginAuthor = async function (req, res) {
  try {
    // req.body.email is used in postman it can be change both sides
    let email = req.body.email
    let password = req.body.password

    let user = await authorModel.findOne({
      email: email,
      password: password
    })

    if (!user) return res.status(400).send({
      status: false,
      msg: " Email or password is incorrect "
    })


    // AUTHENTICATION BEGINS HERE===================

    let token = jwt.sign({
      authorId: user._id.toString(),     // provide the things which are unique like object id
      batch: "Radon",
    },
    "project_1"     // secret key 
  );
    
  res.status(200).send({
    status: true,
    token: "You Are Login In The App",
    data: { token: token }
  });
}
catch (err) {
  return res.status(500).send({ status: false, data: err.message })
}
}

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor
      
















