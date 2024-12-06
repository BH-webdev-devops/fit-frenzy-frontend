"use client";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";

interface Video {
  videoId: string;
  title: string;
  description: string;
}

export default function Exercise() {
  const { setIsAuth, isAuth }: any = useAuth();
  const router = useRouter();

  const youtubeKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

  const [exercises, setExercises] = useState<Video[]>([]);
  const [recommended, setRecommended] = useState<Video[]>([]);
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
            )}&key=${youtubeKey}&maxResults=10`
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

            const videoHistory = JSON.parse(
              localStorage.getItem("videoHistory") || "[]"
            );
            const updatedHistory = [...videoHistory, ...videos].slice(-50); // Keep only the last 50
            localStorage.setItem(
              "videoHistory",
              JSON.stringify(updatedHistory)
            );
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

  const generateRecommendations = useCallback(() => {
    const videoHistory: Video[] = JSON.parse(
      localStorage.getItem("videoHistory") || "[]"
    );
    if (videoHistory.length === 0) return;

    const recommendations: Video[] = [];
    exercises.forEach((video) => {
      let maxSimilarity = 0;
      videoHistory.forEach((historyVideo) => {
        const similarity = computeSimilarity(video, historyVideo);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
        }
      });
      if (maxSimilarity > 0.5) recommendations.push(video);
    });

    setRecommended(recommendations);
  }, [exercises]);

  const computeSimilarity = (video1: Video, video2: Video): number => {
    const vector1 = video1.title.split(" ").map((word) => word.length);
    const vector2 = video2.title.split(" ").map((word) => word.length);

    const maxLength = Math.max(vector1.length, vector2.length);
    const paddedVector1 = Array(maxLength)
      .fill(0)
      .map((_, i) => vector1[i] || 0);
    const paddedVector2 = Array(maxLength)
      .fill(0)
      .map((_, i) => vector2[i] || 0);

    const dotProduct = paddedVector1.reduce(
      (sum, val, i) => sum + val * paddedVector2[i],
      0
    );

    const magnitude1 = Math.sqrt(
      paddedVector1.reduce((sum, val) => sum + val ** 2, 0)
    );
    const magnitude2 = Math.sqrt(
      paddedVector2.reduce((sum, val) => sum + val ** 2, 0)
    );

    return magnitude1 && magnitude2
      ? dotProduct / (magnitude1 * magnitude2)
      : 0;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [isAuth, router]);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      fetchExercises(searchQuery);
    }
  }, [searchQuery, fetchExercises]);

  useEffect(() => {
    if (exercises.length > 0) {
      generateRecommendations();
    }
  }, [exercises, generateRecommendations]);

  return (
    <div className="bg-neutral-800 min-h-screen py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Find a perfect workout for today!
      </h1>
      <div className="w-full flex justify-center mb-6 p-4 text-black">
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
        <>
          <h2 className="text-2xl font-semibold text-white mt-4">
            Recommended Videos:
          </h2>
          <div className="w-full overflow-x-auto my-8">
            <div className="flex gap-10 justify-start items-start">
              {recommended.map((video: Video, index) => (
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
        </>
      ) : (
        <p className="text-center text-white">
          No videos found. Try searching for something else.
        </p>
      )}
    </div>
  );
}
