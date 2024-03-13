import React, { useEffect, useState } from "react";
import ben from "../ben/ben";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

const SUBDOMAIN = import.meta.env.VITE_SUBDOMAIN;
const USER_DOMAIN = import.meta.env.VITE_USER_DOMAIN;

// function PreviewEnvironment() {
//   const { id } = useParams();
//   const [appLink, setAppLink] = useState("");
//   const [commentsLink, setCommentsLink] = useState("");
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const [showComments, setShowComments] = useState(false);

//   useEffect(() => {
//     getUrlAndCommentsById(id)
//       .then((data) => {
//         setAppLink(data.appLink);
//         if (
//           data.appLink !==
//             "http://team5-load-balancer-1882604019.us-east-2.elb.amazonaws.com/2wdsdw" &&
//           data.commentsLink
//         ) {
//           setCommentsLink(data.commentsLink);
//           setShowComments(true);
//           getComments(data.commentsLink)
//             .then(setComments)
//             .catch((err) => {
//               console.error("Error fetching comments:", err);
//             });
//         } else {
//           setShowComments(false);
//         }
//       })
//       .catch((err) => {
//         console.error("Error fetching preview environment data:", err);
//         setShowComments(false);
//         setAppLink(
//           "http://team5-load-balancer-1882604019.us-east-2.elb.amazonaws.com/2wdsdw"
//         );
//       });
//   }, [id]);

//   const onCreateComment = async (e) => {
//     e.preventDefault();
//     if (commentsLink && showComments) {
//       await postComment(newComment, commentsLink);
//       setNewComment("");
//       getComments(commentsLink).then(setComments);
//     }
//   };

//   return (
//     <>
//       {showComments && (
//         <div id="comments">
//           <h1>Comments</h1>
//           {comments.map(({ body, user }, idx) => (
//             <Comment user={user} comment={body} key={idx} />
//           ))}
//           <form onSubmit={onCreateComment}>
//             <label htmlFor="newComment">New Comment:</label>
//             <input
//               id="newComment"
//               type="text"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//             />
//             <button type="submit">Post Comment</button>
//           </form>
//         </div>
//       )}
//       <iframe src={appLink} title="Preview"></iframe>
//     </>
//   );
// }


function CommentsContainer() {
  return (
    <div id="comments-container">
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
  )
}

function FeedbackInterface() {
  

  return (
    <>
      <CommentsContainer></CommentsContainer>
    </>
  )
}

function Preview({ repo, issue_number }) {
  const previewAppLink = `https://${repo}-${issue_number}.${SUBDOMAIN}.${USER_DOMAIN}`;
  return <iframe src={previewAppLink} title="Preview"></iframe>;
}

function PreviewEnvironment() {
  const params = useParams();

  return (
    <>
      <Preview {...params} />
      <FeedbackInterface {...params} />
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

function Dashboard() {
  return <p>This is your dashboard page.</p>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/:repo/:issue_number" element={<PreviewEnvironment />} />
      </Routes>
    </Router>
  );
}

export default App;
