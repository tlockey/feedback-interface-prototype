import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import * as fs from "fs";
import "dotenv/config";

const APP_ID = process.env.APP_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const OWNER = process.env.OWNER;
const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");

let ben = {};

async function getInstallationId(repo) {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey,
    },
  });

  let response = await octokit.request(
    "GET /repos/{owner}/{repo}/installation",
    {
      owner: OWNER,
      repo,
    }
  );
  return response.data.id;
}

let repo = "client-app";

ben.getComments = async function (repo, issue_number) {
  let installationId = await getInstallationId(repo);
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      installationId,
    },
  });

  const response = await octokit.rest.issues.listComments({
    owner: OWNER,
    repo,
    issue_number,
  });
  return response.data;
};

ben.postComment = async function (repo, issue_number, body) {
  let installationId = await getInstallationId(repo);
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: APP_ID,
      privateKey,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      installationId,
    },
  });

  const response = await octokit.rest.issues.createComment({
    owner: OWNER,
    repo,
    issue_number,
    body,
  });

  return response.data;
};

// console.log(
//   "POST",
//   await ben.postComment(repo, "74", "Testing comment from ben!!!")
// );
// console.log("GET", await ben.getComments(repo, "74"));

export default ben;
