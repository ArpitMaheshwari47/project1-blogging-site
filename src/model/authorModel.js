const mongoose = require('mongoose');

const author = new mongoose.Schema({

    fname:{
        type: String,
        required: true,
        trim: true
    },
    lname:{
        type: String,
        required: true,
        trim: true
    },
    title:{
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"],
        trim: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase:true,
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    
}, { timestamps: true } );

module.exports = mongoose.model('Project 1 Author', author) // AuthorProjects