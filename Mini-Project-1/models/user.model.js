import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/miniproject')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
    email: String,
    name: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
})

const User = mongoose.model('User', userSchema)
export default User;