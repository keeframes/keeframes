import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css"
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";

function Home() {
  const [edits, setEdits] = useState([]);

  useEffect(() => {
    const getEdits = async () => {
      const response = await httpClient.get(`${API_URL}/edits`);
      console.log(response.data)
      setEdits(response.data);
    }
    getEdits()
  }, []);


  return (
    <>
      <div className={styles.container}>
        {edits.map((edit, index) => 
          <React.Fragment key={index}>
            <p>@{edit.user.username}</p>
            <VideoPlayer url={edit.url}/>
            <p>{edit.caption}</p>
          </React.Fragment>
        )}
      </div>
    </>
  );
}

export default Home;
