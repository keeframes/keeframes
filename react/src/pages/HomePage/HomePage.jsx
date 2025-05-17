import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css"
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import { useCurrentUser } from "../../hooks/contexts";

function Home() {
  const { user } = useCurrentUser();
  const [edits, setEdits] = useState([]);

  useEffect(() => {
    const getEdits = async () => {
      const response = await httpClient.get(`${API_URL}/edits`);
      console.log(response.data)
      setEdits(response.data);
    }
    getEdits()
  }, []);


  const handleDelete = async (e) => {
    e.preventDefault()

    try {
      const response = await httpClient.delete(`${API_URL}/user`)
      console.log(response.data);
    } catch (err) {
      console.error(e);
    }
  }


  return (
    <>
      <div className={styles.container}>
        <p>{user?.nickname}</p>
        <button onClick={handleDelete}>DELETE MY ACCOUNT</button>
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
