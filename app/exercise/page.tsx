/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";

export default function Exercise() {
  const { setIsAuth, isLoggedIn }: any = useAuth();
  const router = useRouter();

  const youtubeKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("Workouts");
  const [loading, setLoadingState] = useState(false);

  const fetchExercises = useCallback(
    async (query: string) => {
      const token = localStorage.getItem("token");
      if (token && isLoggedIn) {
        setLoadingState(true);
        try {
          const res = await fetch(
            `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(
              query
            )}&key=${youtubeKey}&maxResults=50`
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
            router.push("/login");
            console.error("Failed to fetch videos");
            setIsAuth(false);
          }
        } catch (err) {
          setIsAuth(false);
          console.error(`Error fetching videos: ${err}`);
          router.push("/login");
        } finally {
          setLoadingState(false);
        }
      } else {
        setLoadingState(false);
      }
    },
    [youtubeKey, router, setIsAuth]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isLoggedIn) {
      router.push("/login");
    }
    fetchExercises(searchQuery);
  }, [isLoggedIn, fetchExercises, router]);

  return (
    <div className="bg-neutral-800 min-h-screen py-10 px-4 flex flex-col items-center">
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
                  height="100%"
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
