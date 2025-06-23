import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { UserModel } from "./models/user.models.js";
import { log } from "console";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cookieParser())


// app.get("/", (req, res) => {
//     bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash("password", salt, (err, hash) => {
//             res.cookie("token", hash)
//             res.render("index");
//         })
//     })
// });

app.get("/", (req, res) => {
    const token = jwt.sign({email: "anuppradha@gmal.com"}, "anup")
    res.cookie("token", token)
    log(token)
    res.render("index");
});

app.get("/read", async (req, res) => {
  const allUsers = await UserModel.find();
  res.render("read", { users: allUsers });
});

app.get("/delete/:id", async (req, res) => {
  const users = await UserModel.findByIdAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  const editedUser = await UserModel.findById({ _id: req.params.id });
  res.render("edit", { user: editedUser });
});

app.post("/update/:id", async (req, res) => {
  const { name, email, imageUrl } = req.body;
  const updatedUser = await UserModel.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: name,
      email: email,
      imageUrl: imageUrl,
    }
  );
  res.redirect("/read");
});

app.post("/create", async (req, res) => {
  const { name, email, imageUrl } = req.body;
  const createdUser = await UserModel.create({
    name: name,
    email: email,
    imageUrl: imageUrl,
  });
  res.redirect("/read");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log("http://localhost:3000");
});
