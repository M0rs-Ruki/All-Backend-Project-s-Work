import express from "express";
import User from "./models/user.model.js"
import Post from "./models/post.model.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import upload from "./utils/multer.utils.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index');
})

app.get('/profile/upload',isLoggedin,async (req, res) => {
  const user = await User.findOne({email: req.user.email})
    res.render('profileUpload', {user: user});
})

app.post('/upload',isLoggedin, upload.single('image'), async (req, res) => {
  const user = await User.findOne({email: req.user.email})
  // console.log(req.file.filename);
  // log(req.file)
  user.profilePic = req.file.filename;
  await user.save();
  // log(user)
  res.redirect('/profile');
})

// Registring
app.post('/register', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    if(user) return res.status(500).send('User already exists');
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (err, hash) => {
            const user = await User.create({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                age: req.body.age,
            });
            const token = jwt.sign({ email: req.body.email, userid: user._id }, "secretkey");
            res.cookie("token", token)
            res.send("User created successfully")
        })
    })
})

// login
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send('User not found');
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) return res.status(500).send('Error during login');
    if (result) {
      const token = jwt.sign({ email, userid: user._id }, "secretkey");
      res.cookie("token", token);
      return res.status(200).redirect('/profile');
    } else {
      return res.status(401).send('Incorrect password');
    }
  });
});

// logout
app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

// create
app.post('/create', (req, res) => {
    res.send('Hello World!')
})

// profile
app.get('/profile', isLoggedin, async (req, res) => {
  const user = await User.findOne({email: req.user.email}).populate('posts')
  res.render('profile', {user: user});
})

//post
app.post('/post', isLoggedin, async (req, res) => {
  const user = await User.findOne({email: req.user.email})
  const post = await Post.create({
    user: user._id,
    content: req.body.content
  })
  user.posts.push(post._id)
  await user.save()
  res.redirect('/profile')
})

//like
app.get('/like/:id', isLoggedin, async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user');
  const userId = req.user.userid;
  const likeIndex = post.likes.indexOf(userId);
  if (likeIndex === -1) {
    // If user hasn't liked it yet, add their ID
    post.likes.push(userId);
  } else {
    // If user already liked it, remove their ID
    post.likes.splice(likeIndex, 1);
  }
  await post.save();
  res.redirect('/profile');
});

// Edit
app.get('/edit/:id', isLoggedin, async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user');
  res.render('edit', {post: post});
});

// Update
app.post('/update/:id', isLoggedin, async (req, res) => {
  const post = await Post.findByIdAndUpdate({_id: req.params.id}, {
    content: req.body.content
  })
  res.redirect('/profile');
})


function isLoggedin(req, res, next) {
  if (req.cookies.token === undefined) {
    res.redirect('/login');
  } else {
    const token = jwt.verify(req.cookies.token, "secretkey");
    req.user = token;
    next();
  }
}

app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
    console.log('http://localhost:3000');
})
