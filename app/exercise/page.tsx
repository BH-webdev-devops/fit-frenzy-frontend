/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";

export default function Exercise() {
  const { setIsAuth }: any = useAuth();
  const router = useRouter();

  const YOUTUBE_API_KEY = "AIzaSyBAMPCWsBBl-sygmeX2nJmG_op6VFI8Yfo";
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Workouts");
  const [loading, setLoadingState] = useState(false);

  const fetchExercises = useCallback(
    async (query: string) => {
      const token = localStorage.getItem("token");
      if (token) {
        setLoadingState(true);
        try {
          const res = await fetch(
            `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(
              query
            )}&key=${YOUTUBE_API_KEY}&maxResults=50`
          );

          if (res.ok) {
            const data = await res.json();
            const videos = data.items.map((item: any) => ({
              videoId: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.medium.url,
              description: item.snippet.description,
            }));
            setIsAuth(true);
            setExercises(videos);
          } else {
            router.push("/register");
            console.error("Failed to fetch videos");
            setIsAuth(false);
          }
        } catch (err) {
          setIsAuth(false);
          console.error(`Error fetching videos: ${err}`);
        } finally {
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
      }
    },
    [YOUTUBE_API_KEY, router, setIsAuth]
  );

  // Debounced search while typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchExercises(searchQuery);
      }
    }, 500); // Adjust debounce delay as needed
    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchExercises]);

  useEffect(() => {
    fetchExercises(searchQuery);
  }, []);

  return (
    <div className="bg-neutral-700 min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Find a perfect workout for today!
      </h1>
      <div className="w-full flex justify-center mb-6 p-4">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-6 py-3 w-3/4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
      </div>
      {loading ? (
        <p className="text-center text-white">Loading videos...</p>
      ) : exercises.length > 0 ? (
        <div className="w-full overflow-x-auto my-44">
          <div className="flex gap-10 justify-start items-start">
            {exercises.map((video, index) => (
              <div
                key={index}
                className="flex-none w-[400px] h-[600px] bg-white rounded-lg shadow-md p-4"
              >
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${video.videoId}`}
                  width="100%"
                  height="100%" // Adjusted height for video cards
                  className="rounded-lg overflow-hidden"
                />
                <h3 className="text-lg font-semibold mt-4 text-gray-800 text-center truncate">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm text-center truncate">
                  {video.description.slice(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-white">
          No videos found. Try searching for something else.
        </p>
      )}
    </div>
  );
}
