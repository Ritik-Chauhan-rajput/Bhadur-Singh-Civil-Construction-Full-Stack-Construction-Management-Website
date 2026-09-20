const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("TEST SERVER WORKING");
});

app.listen(5000, "127.0.0.1", () => {
  console.log("TEST SERVER RUNNING ON PORT 5000");
});