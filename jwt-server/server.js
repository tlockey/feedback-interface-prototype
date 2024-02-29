const express = require("express");
const app = express();
const PORT = 3002;
const generateToken = require("./generator");
const cors = require("cors");

app.use(cors());

app.get("/jwt", (req, res) => {
  const jwt = generateToken();
  res.json({ jwt });
});

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`);
});
