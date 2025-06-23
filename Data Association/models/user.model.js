import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/dataASS')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    posts: Array
})

const User = mongoose.model('User', userSchema)
export default User;