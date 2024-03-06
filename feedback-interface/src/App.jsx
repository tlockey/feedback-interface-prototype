import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

// Sample mapping of IDs to URLs
const idToUrlMapping = {
  "1234": "https://zipxam.com",
  "6661": "https://westonludeke.com",
  "5678": "https://rainbucket.xyz"
};

const pullRequestCommentsLink = "https://api.github.com/repos/rainbucket-xyz/rainbucket/issues/17/comments";
const installationLink = "https://api.github.com/orgs/rainbucket-xyz/installation";
const jwtLink = "http://localhost:3002/jwt";

async function getComments() {
  let response = await axios.get(pullRequestCommentsLink);
  response = response.data;
  return response.map((comment) => ({
    body: comment.body,
    user: comment.user.login,
  }));
}

async function generateToken() {
  const response = await axios.get(jwtLink);
  console.log(response.data);
  const { jwt } = response.data;
  return jwt;
}

async function getInstallationID(jwt) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${jwt}`,
  };

  // Get installation ID
  let response = await axios.get(installationLink, { headers });
  return response.data.id;
}

async function getAuthentication() {
  // Get JWT Token
  const jwt = await generateToken();
  console.log("generated jwtToken: ", jwt);

  // Get installation id using jwt
  const installationID = await getInstallationID(jwt);
  console.log("installationID: ", installationID);

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${jwt}`,
  };

  // Get installation access token
  const installationAccessTokenLink = `https://api.github.com/app/installations/${installationID}/access_tokens`;
  let response = await axios.post(installationAccessTokenLink, null, { headers });

  console.log(response.data);
  return response.data.token;
}

async function postComment(comment) {
  let authorization = await getAuthentication();
  console.log("authorization: ", authorization);
  let headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${authorization}`,
  };
  let response = await axios.post(pullRequestCommentsLink, { body: comment }, { headers });
  // probably update the comments in our preview interface
}

function PreviewEnvironment() {
  const { id } = useParams(); // Fetching the `id` from the URL
  const [appLink, setAppLink] = useState("https://rainbucket.xyz/"); // Default URL
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const url = idToUrlMapping[id];
    if (url) {
      setAppLink(url);
    }

    getComments().then((comments) => setComments(comments));
    getAuthentication();
  }, [id]);

  const onCreateComment = async (e) => {
    e.preventDefault();
    await postComment(newComment);
    setNewComment("");
  };

  return (
    <>
      <div id="comments">
        <h1>Comments</h1>
        {comments.map(({ body, user }, idx) => (
          <Comment user={user} comment={body} key={idx} />
        ))}
        <form onSubmit={onCreateComment}>
          <label htmlFor="newComment">New Comment: </label>
          <input
            id="newComment"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
      <iframe src={appLink} title="Preview" ></iframe>
    </>
  );
}

function Comment({ user, comment }) {
  return (
    <>
      <p>
        {comment} - {user}
      </p>
      <hr />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/preview/:id" element={<PreviewEnvironment />} />
      </Routes>
    </Router>
  );
}

export default App;
