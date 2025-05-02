import { useEffect } from "react";
import "../index.css";
import { API_URL } from "../utils/constants";
import axios from "axios";
import { useState } from "react";

function Home() {
  const [video, setVideo] = useState({
    cookies: null,
    url: null,
  });

  useEffect(() => {
    const getVideoSrc = async () => {
      try {
        const response = await axios.get(`${API_URL}/video/ds`);
        setVideo({
          ...video,
          cookies: response.data.cookies,
          url: response.data.url,
        });
      } catch (error) {
        console.error(error);
      }
    };
    getVideoSrc();
  }, []);

  useEffect(() => {
    console.log(video);
  }, [video]);

  return (
    <>
      <div>
        <video
          width={1920 / 2}
          height={1080 / 2}
          src={video.url}
          controls
        ></video>
      </div>
    </>
  );
}

export default Home;
