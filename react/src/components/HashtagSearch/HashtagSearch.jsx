import styles from "./HashtagSearch.module.css"
import Hashtag from "../../assets/hashtag.svg?react"
import { useState } from "react";

function HashtagSearch({ setHashtag }) {
  const [searchHashtags, setSearchHashtags] = useState([]);

  return (
    <>
      <div className={styles.background}/>
      <div className={styles.modal}>
        <input type="search" className={styles.search}/>
        <div className={styles.hashtags}>
          <div className={styles.hashtag}>
            <div className={styles.hashContainer}>
              <Hashtag/>
            </div>
            <div className={styles.contents}>
              <p className={styles.hash}>this</p>
              <p className={styles.edits}>280m edits</p>
            </div>
          </div>
          <div className={styles.hashtag}>
            <div className={styles.hashContainer}>
              <Hashtag/>
            </div>
            <div className={styles.contents}>
              <p className={styles.hash}>this</p>
              <p className={styles.edits}>280m edits</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HashtagSearch;
