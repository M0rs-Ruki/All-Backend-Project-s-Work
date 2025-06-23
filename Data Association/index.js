import express from 'express';
import User from './models/user.model.js';
import Post from './models/post.model.js';


const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/create', async (req, res) => {
  const user = await User.create({
    username: "Mors code",
    age: 55,
    email: "mors@code.com"
  })
  res.send(user)
})

app.get('/create-post', async (req, res) => {
  const post = await Post.create({
    postData: "MOrs is a nood coder!!!",
    user: "6859ab17abd73a82af7c0fb4"
  })
  const user = await User.findOne({ _id: "6859ab17abd73a82af7c0fb4" })
  user.posts.push(post._id)
  await user.save()
  res.send({post, user})
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});