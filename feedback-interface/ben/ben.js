import { Octokit, App } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import * as fs from "fs";
import "dotenv/config";

const APP_ID = process.env.APP_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
// const app = new App({ appId: APP_ID, privateKey });

const auth = createAppAuth({
  appId: APP_ID,
  privateKey,
  clientId: "",
  clientSecret: "",
});

// Retrieve JSON Web Token (JWT) to authenticate as app
const appAuthentication = await auth({ type: "app" });
console.log(appAuthentication);

// const octokit = await app.getInstallationOctokit(APP_ID);
// console.log(octokit);
// const response = await octokit.request(
//   "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
//   {
//     owner: "preview-app-team5",
//     repo: "client-app",
//     issue_number: "41",
//     headers: {
//       "X-GitHub-Api-Version": "2022-11-28",
//     },
//   }
// );

// console.log(response);
// ben.getComments
function getComments() {}
// ben.postComment
