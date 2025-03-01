import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById } from "../features/postSlice";
import LoadingSpinner from "./LoadingSpinner";

function PostDetails() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPost, status, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostById(postId));
  }, [dispatch, postId]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  if (!currentPost) {
    return null;
  }

  return (
    <div className="post-details">
      <button className="back-button" onClick={() => navigate("/")}>
        Back Button
      </button>

      <article className="post-content">
        <h1>{currentPost.title}</h1>
        <p>{currentPost.body}</p>
        <span>Posted by : {currentPost.userId}</span>
      </article>

      <section className="comment-section">
        <h2>Comments</h2>
        <div className="comment-list">
          {currentPost.comments?.map((comment) => (
            <div key={comment.id}>
              <h4>{comment.name}</h4>
              <h4>{comment.email}</h4>
              <span>{comment.body}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PostDetails;
