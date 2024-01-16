const express = require("express");

const app = express();
app.get("/", (req, res) => {
  res.status(200).send({ status: true, message: "Welcome to React blog api" });
});
app.listen(8001, () => {
  console.log("app listening on port 8001");
});
