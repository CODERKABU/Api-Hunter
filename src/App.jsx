import React from "react";
import "./App.css";
import PostList from "./components/PostList";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostDetails from "./components/PostDetails";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/:postId" element={<PostDetails />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
