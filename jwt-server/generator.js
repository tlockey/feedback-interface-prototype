const jwt = require("jsonwebtoken");
const fs = require("fs");

const APP_ID = "843556"; // make a request (CURRENTLY FROM APP PAGE) maybe through GET https://api.github.com/orgs/rainbucket-xyz/installation
const ALGO = "RS256";
const PRIVATE_KEY_LOCATION = "./ben.private-key.pem"; // verify if .private-key required for file name
const TEN_MINUTES_IN_SECONDS = 600;
const MINUTE_IN_SECONDS = 60;

function generateToken() {
  const payload = {
    iat: Math.floor(Date.now() / 1000) - MINUTE_IN_SECONDS,
    exp: Math.floor(Date.now() / 1000) + TEN_MINUTES_IN_SECONDS,
    iss: APP_ID,
    alg: ALGO,
  };

  const privateKey = fs.readFileSync(PRIVATE_KEY_LOCATION, "utf8");
  const token = jwt.sign(payload, privateKey, { algorithm: ALGO });

  return token;
}

module.exports = generateToken;
