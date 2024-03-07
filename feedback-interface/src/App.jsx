import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

const installationLink = "https://api.github.com/orgs/rainbucket-xyz/installation";
const jwtLink = "http://localhost:3002/jwt";

async function getUrlAndCommentsById(id) {
  try {
    const urlResponse = await axios.get(`http://localhost:3001/api/preview/${id}`);
    const commentsResponse = await axios.get(`http://localhost:3001/api/comments/${id}`);
    return { appLink: urlResponse.data.url, commentsLink: commentsResponse.data.prLink };
  } catch (error) {
    // console.error("Error fetching data by ID:", error);
    return { appLink: "http://team5-load-balancer-1882604019.us-east-2.elb.amazonaws.com/2wdsdw" };
  }
}

async function getComments(commentsLink) {
  try {
    const response = await axios.get(commentsLink);
    return response.data.map(comment => ({
      body: comment.body,
      user: comment.user.login,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return []; 
  }
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

async function postComment(comment, commentsLink) {
  let authorization = await getAuthentication();
  let headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${authorization}`,
  };
  await axios.post(commentsLink, { body: comment }, { headers });
}

function PreviewEnvironment() {
  const { id } = useParams();
  const [appLink, setAppLink] = useState("");
  const [commentsLink, setCommentsLink] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false); 

  useEffect(() => {
    getUrlAndCommentsById(id).then(data => {
      setAppLink(data.appLink);
      if (data.appLink !== "http://team5-load-balancer-1882604019.us-east-2.elb.amazonaws.com/2wdsdw" && data.commentsLink) {
        setCommentsLink(data.commentsLink);
        setShowComments(true);
        getComments(data.commentsLink)
          .then(setComments)
          .catch(err => {
            console.error("Error fetching comments:", err);
          });
      } else {
        setShowComments(false);
      }
    }).catch(err => {
      console.error("Error fetching preview environment data:", err);
      setShowComments(false);
      setAppLink("http://team5-load-balancer-1882604019.us-east-2.elb.amazonaws.com/2wdsdw");
    });
  }, [id]);

  const onCreateComment = async (e) => {
    e.preventDefault();
    if (commentsLink && showComments) {
      await postComment(newComment, commentsLink);
      setNewComment("");
      getComments(commentsLink).then(setComments);
    }
  };

  return (
    <>
      {showComments && (
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
      )}
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
