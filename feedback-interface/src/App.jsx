import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

const pullRequestCommentsLink =
  "https://api.github.com/repos/rainbucket-xyz/rainbucket/issues/17/comments";
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
  const { jwt } = response.data;
  return jwt;
}

async function getInstallationID(jwt) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${jwt}`,
  };
  let response = await axios.get(installationLink, { headers });
  return response.data.id;
}

async function getAuthentication() {
  const jwt = await generateToken();
  const installationID = await getInstallationID(jwt);
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${jwt}`,
  };
  const installationAccessTokenLink = `https://api.github.com/app/installations/${installationID}/access_tokens`;
  let response = await axios.post(installationAccessTokenLink, null, { headers });
  return response.data.token;
}

async function postComment(comment) {
  let authorization = await getAuthentication();
  let headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${authorization}`,
  };
  await axios.post(
    pullRequestCommentsLink,
    { body: comment },
    { headers }
  );
}

async function getUrlById(id) {
  try {
    const response = await axios.get(`http://localhost:3001/api/preview/${id}`);
    return response.data.url;
  } catch (error) {
    console.error("Error fetching URL by ID:", error);
    return "https://zipxam.com/404"; // example 404 page (i.e. fallback URL if underlying page doesn't load)
  }
}

function PreviewEnvironment() {
  const { id } = useParams();
  const [appLink, setAppLink] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    getUrlById(id).then(setAppLink);
    getComments().then(setComments);
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
          <label htmlFor="newComment">New Comment:</label>
          <input
            id="newComment"
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post Comment</button>
        </form>
      </div>
      <iframe src={appLink} title="Preview"></iframe>
    </>
  );
}

function Comment({ user, comment }) {
  return (
    <>
      <p>{comment} - {user}</p>
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
