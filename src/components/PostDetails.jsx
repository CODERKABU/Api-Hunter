import React, { useEffect } from "react";
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
      <div className="flex flex-col items-center justify-center p-4 bg-red-100 text-red-700 rounded-md">
        <h3 className="text-xl font-bold">Error</h3>
        <p className="text-sm">{error}</p>
        <button 
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!currentPost) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button 
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        onClick={() => navigate("/")}
      >
        Back
      </button>

      <article className="space-y-4">
        <h1 className="text-2xl font-bold">{currentPost.title}</h1>
        <p className="text-gray-700">{currentPost.body}</p>
        <span className="text-sm text-gray-500">Posted by: {currentPost.userId}</span>
      </article>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <div className="space-y-4">
          {currentPost.comments?.map((comment) => (
            <div key={comment.id} className="p-4 border rounded-md shadow-sm bg-gray-100">
              <h4 className="text-sm font-semibold">{comment.name}</h4>
              <h4 className="text-xs text-gray-500">{comment.email}</h4>
              <span className="text-gray-700">{comment.body}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PostDetails;
