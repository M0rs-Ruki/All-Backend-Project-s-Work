import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/dataASS')

const postSchema = new mongoose.Schema({
    postData: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model('Post', postSchema)
export default Post;