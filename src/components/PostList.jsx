import React from "react";
import { useEffect } from "react";
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
  const naviagte = useNavigate();

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
  const handleClearFilter = (userId) => {
    dispatch(clearFilters());
  };

  const handlePostClick = (postId) => {
    naviagte(`/posts/${postId}`);
  };

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "failed") {
    return (
      <div className="error-container">
        <h3>Error</h3>
        <p>{error}</p>
        <button
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
    <div className="posts-container">
      <div className="search-bar">
        <input
          type=" text"
          placeholder="Search post"
          value={searchTerm}
          onChange={handleSearch}
        />

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => dispatch(setSearchTerm(""))}
          >
            Clear search
          </button>
        )}

        <div className="filters">
          <select
            value={filters.userId || ""}
            onChange={(e) => {
              handleUserFilter(e.target.value ? Number(e.target.value) : null);
            }}
          >
            <option value="">All Users</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                User {i + 1}
              </option>
            ))}
          </select>

          {(filters.userId || searchTerm) && (
            <button className="clear-filter" onClick={handleClearFilter}>
              Clear Filter
            </button>
          )}
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onClick={() => handlePostClick(post.userId)}
          >
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}...</p>
            <span>User : {post.userId}</span>

            <button
              className="read-more"
              onClick={() => handlePostClick(post.userId)}
            >
              read more
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
