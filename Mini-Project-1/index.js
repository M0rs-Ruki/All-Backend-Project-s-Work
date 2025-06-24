import express from "express";
import User from "./models/user.model.js"
import Post from "./models/post.model.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express()

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index');
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
      return res.status(200).send('Login successful');
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


app.get('/pro', isLoggedin, (req, res) => {
    console.log(req.user);
    res.render('index');
})

function isLoggedin(req, res, next) {
  if (req.cookies.token === undefined) {
    res.send('You must be logged in');
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