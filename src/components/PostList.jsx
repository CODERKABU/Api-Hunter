import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import Pagination from "./Pagination";
import {
  fetchPosts,
  setSearchTerm,
  setCurrentPage,
  setFilter,
  clearFilters,
} from "../features/postSlice";

function PostList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    status,
    error,
    searchTerm,
    currentPage,
    totalPosts,
    postsPerPage,
    filters,
  } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: postsPerPage }));
  }, [dispatch, currentPage, postsPerPage]);

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleUserFilter = (userId) => {
    dispatch(setFilter({ userId }));
  };
  const handleClearFilter = () => {
    dispatch(clearFilters());
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-100 text-red-600 rounded-lg shadow-lg border border-red-400">
        <h3 className="text-2xl font-bold">Error</h3>
        <p className="text-lg">{error}</p>
        <button
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md"
          onClick={() => dispatch(fetchPosts({ page: 1, limit: postsPerPage }))}
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredPosts = items.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !filters.userId || post.userId === filters.userId;
    return matchesSearch && matchesUser;
  });

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-100 rounded-xl shadow-xl">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search post..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:w-1/2 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-600"
        />

        {searchTerm && (
          <button
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md"
            onClick={() => dispatch(setSearchTerm(""))}
          >
            Clear
          </button>
        )}

        <select
          value={filters.userId || ""}
          onChange={(e) => {
            handleUserFilter(e.target.value ? Number(e.target.value) : null);
          }}
          className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-600"
        >
          <option value="" className="text-gray-500">All Users</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1} className="text-gray-600">
              User {i + 1}
            </option>
          ))}
        </select>

        {(filters.userId || searchTerm) && (
          <button
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => handlePostClick(post.id)}
          >
            <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
            <p className="text-gray-600 text-sm">{post.body.substring(0, 100)}...</p>
            <span className="block mt-2 text-sm text-gray-500 font-semibold">User: {post.userId}</span>
            <button
              className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              Read more
            </button>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPosts={totalPosts}
        postsPerPage={postsPerPage}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />
    </div>
  );
}

export default PostList;
