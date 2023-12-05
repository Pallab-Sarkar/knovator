const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/config.json");
const PORT = config.development.node_port;
const authController = require("./controller/AuthController.js");
const postController = require("./controller/PostController.js");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//db connection
mongoose.connect(config.development.db_url, { useNewUrlParser: true });

mongoose.connection.on("connected", function () {
  console.log("Connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.error("error in connecting to db" + err);
});

app.use("/api/auth", authController);
app.use("/api/posts", postController);

app.get("/", (req, res) => {
  res.send(`Welcome to node api!`);
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}`);
});
