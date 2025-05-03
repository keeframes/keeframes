import React, { useEffect } from "react";
import { API_URL } from "../utils/constants";
import styles from "../styles/HomePage.module.css"
import { useState } from "react";
import httpClient from "../utils/httpClient";

function Home() {
  const [edits, setEdits] = useState([]);

  useEffect(() => {
    const getEdits = async () => {
      const response = await httpClient.get(`${API_URL}/edits`);
      setEdits(response.data.edits);
    }
    getEdits()
  }, []);


  return (
    <>
      <div className={styles.container}>
        {edits.map((edit, index) => 
          <React.Fragment key={index}>
            <p>@{edit.user.username}</p>
            <edit
              key={index}
              width={1920 / 2}
              height={1080 / 2}
              src={edit.url}
              controls
            />
            <p>{edit.caption}</p>
          </React.Fragment>
        )}
      </div>
    </>
  );
}

export default Home;
