const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    image: {
        type:String,
        default:"https://res.cloudinary.com/pranav/image/upload/v1604205853/no-image.png"
    },
    followers:[{type:ObjectId, ref: "User"}],
    following:[{type:ObjectId, ref: "User"}]
})

module.exports = mongoose.model('User', userSchema)