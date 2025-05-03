import React, { useEffect } from "react";
import { API_URL } from "../utils/constants";
import styles from "../styles/HomePage.module.css"
import { useState } from "react";
import httpClient from "../utils/httpClient";

function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getVideos = async () => {
      const response = await httpClient.get(`${API_URL}/videos`);
      setVideos(response.data.videos);
    }
    getVideos()
  }, []);


  return (
    <>
      <div className={styles.container}>
        {videos.map((video, index) => 
          <React.Fragment key={index}>
            <p>@{video.user.username}</p>
            <video
              key={index}
              width={1920 / 2}
              height={1080 / 2}
              src={video.url}
              controls
            />
            <p>{video.caption}</p>
          </React.Fragment>
        )}
      </div>
    </>
  );
}

export default Home;
