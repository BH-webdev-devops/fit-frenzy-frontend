/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Exercise() {
  const {
    setLoading,
    setIsAuth,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = useAuth();
  const router = useRouter();

  const YOUTUBE_API_KEY = "AIzaSyBAMPCWsBBl-sygmeX2nJmG_op6VFI8Yfo";
  const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

  const [exercises, setExercies] = useState([]);

  //   useEffect(() => {
  //     if (!loading && !isAuth && !user) {

  //     }
  //   }, [loading, isAuth, router]);

  const fetchExercises = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const query = "exercise";
        const res = await fetch(
          `${YOUTUBE_API_URL}?part=snippet&type=video&q=${encodeURIComponent(
            query
          )}&key=${YOUTUBE_API_KEY}&maxResults=5`
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
          setExercies(videos);
          console.log(videos);
        } else {
          router.push("/register");
          console.error("Failed to fetch videos");
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
        console.error(`Error fetching videos: ${err}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div>
      <h1>Exercise Videos</h1>
      {exercises.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {exercises.map((video, index) => (
            <div key={index} style={{ maxWidth: "300px" }}>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${video.videoId}`}
                width="100%"
                height="200px"
              />
              <h3>{video.title}</h3>
              <p>{video.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
}
