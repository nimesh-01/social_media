const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email_id: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    profile_img: String,
    profile_img_id: String,
})
const userModel = mongoose.model('user', userSchema)
module.exports = userModel