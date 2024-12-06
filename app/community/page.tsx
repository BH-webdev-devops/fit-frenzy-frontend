"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaPaperPlane } from "react-icons/fa"; // Import the FaTrash and FaArrowRight icons
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function Community() {
  const { isAuth, user }: any = useAuth();
  const [posts, setPosts] = useState<
    {
      title: string;
      id: number;
      user_id: number;
      user_name: string;
      content: string;
      created_at: any;
      replies: {
        id: number;
        name: string;
        comment: string;
        created_at: any;
        user_id: number;
        user_name: string;
      }[];
    }[]
  >([]);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [postId, setPostId] = useState(null);
  const [comment, setComment] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [post, setPost] = useState("");
  const [title, setTitle] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [visibleReplies, setVisibleReplies] = useState<{
    [key: number]: boolean;
  }>({});
  const [reply, setReply] = useState(""); // State for reply input
  const [postError, setPostError] = useState(""); // State for post error
  const [replyError, setReplyError] = useState(""); // State for reply error

  useEffect(() => {
    fetchPosts(currentPage);
  }, []);

  const host = process.env.NEXT_PUBLIC_API_URL;

  const fetchPosts = async (page: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/posts?page=${page}&limit=9`, {
      method: "GET",
      headers: { Authorization: `${token}` },
    });
    const data = await response.json();
    if (response.ok) {
      setPosts(data.result);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } else {
      console.error(
        "Error fetching weight entries:",
        response.status,
        response.statusText
      );
    }
  };
  const fetchReplies = async (postId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/posts/${postId}/reply`, {
      method: "GET",
      headers: { Authorization: `${token}` },
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, replies: data.result } : post
        )
      );
      setVisibleReplies((prevVisibleReplies) => ({
        ...prevVisibleReplies,
        [postId]: true,
      }));
    } else {
      console.error(
        "Error fetching replies:",
        response.status,
        response.statusText
      );
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post.trim()) {
      setPostError("Post content cannot be empty");
      return;
    }
    setPostError("");
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/posts`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content: post }),
    });
    if (response.ok) {
      fetchPosts(currentPage);
      setShowPostForm(false);
      setTitle("");
      setPost("");
    } else {
      console.error(
        "Error creating post:",
        response.status,
        response.statusText
      );
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!reply.trim()) {
      setReplyError("Reply content cannot be empty");
      return;
    }
    setReplyError("");
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/posts/${postId}/reply`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: reply }),
    });
    if (response.ok) {
      fetchReplies(postId);
      setReply(""); // Clear the reply input
      setShowCommentForm(false);
    } else {
      console.error(
        "Error submitting reply:",
        response.status,
        response.statusText
      );
    }
  };

  const toggleReplies = (postId: number) => {
    if (visibleReplies[postId]) {
      setVisibleReplies((prevVisibleReplies) => ({
        ...prevVisibleReplies,
        [postId]: false,
      }));
    } else {
      fetchReplies(postId);
    }
  };

  const handleDeletePost = async (postId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${host}/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `${token}` },
    });
    if (response.ok) {
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } else {
      console.error(
        "Error deleting post:",
        response.status,
        response.statusText
      );
    }
  };

  const handleDeleteReply = async (postId: number, replyId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${host}/api/posts/${postId}/reply/${replyId}`,
      {
        method: "DELETE",
        headers: { Authorization: `${token}` },
      }
    );
    if (response.ok) {
      fetchReplies(postId);
    } else {
      console.error(
        "Error deleting reply:",
        response.status,
        response.statusText
      );
    }
  };

  return (
    <div className="community-container">
      <form onSubmit={handlePostSubmit} className="post-form">
        <textarea
          value={post}
          onChange={(e) => setPost(e.target.value)}
          placeholder="Write a new post..."
        />
        <button type="submit">
          <FaPaperPlane />
        </button>
        {postError && <p className="error">{postError}</p>}
      </form>
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p> - {post.user_name}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>
            <button
              className="small-button"
              onClick={() => toggleReplies(post.id)}
            >
              {visibleReplies[post.id] ? "Hide Replies" : "Show Replies"}
            </button>
            {user && post.user_id === user.id && (
              <button
                className="small-button delete-button"
                onClick={() => handleDeletePost(post.id)}
              >
                <FaTrash /> {/* Use the FaTrash icon */}
              </button>
            )}
            {visibleReplies[post.id] && (
              <div className="replies-container">
                {post.replies?.map((reply) => (
                  <div key={reply.id} className="reply">
                    <p className="reply-user-name">{reply.user_name}</p>
                    <p className="reply-comment">{reply.comment}</p>
                    <p> - {reply.user_name}</p>
                    <small>{new Date(reply.created_at).toLocaleString()}</small>
                    {user &&
                      reply.user_id === user.id && ( // Check if the current user is the owner of the reply
                        <button
                          className="small-button delete-button"
                          onClick={() => handleDeleteReply(post.id, reply.id)}
                        >
                          <FaTrash /> {/* Use the FaTrash icon */}
                        </button>
                      )}{" "}
                  </div>
                ))}
                <form
                  onSubmit={(e) => handleReplySubmit(e, post.id)}
                  className="reply-form"
                >
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <button type="submit">
                    <FaPaperPlane></FaPaperPlane>
                  </button>
                  {replyError && <p className="error">{replyError}</p>}
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
