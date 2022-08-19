const require = createRequire(import.meta.url);
var http = require("http");
const express = require("express");
const app = express();
const port = 8000;
const path = require("path");
const fs = require("fs");

app.use(express.static("node_modules"));
app.use(express.static("public"));
app.use(express.static("models"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log("starting server at port 8000..");
});
