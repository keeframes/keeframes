import IconButton from "../IconButton/IconButton";
import Exit from "../../assets/exit.svg?react";
import Plus from "../../assets/plus.svg?react";
import styles from "./CreateHashtags.module.css";
import { useState } from "react";
import HashtagSearch from "../HashtagSearch/HashtagSearch";

function CreateHashtags({ hashtags }) {
  const [openSearch, setOpenSearch] = useState(true);
  const [hashtag, setHashtag] = useState(null);

  return (
    <>
      <HashtagSearch setHashtag={setHashtag}/>
      <div className={styles.hashtags}>
        {hashtags.map((hashtag, index) => (
          <div className={styles.hashtag} key={index}>
            <p>{hashtag}</p>
            <button className={styles.remove}>
              <Exit />
            </button>
          </div>
        ))}
        <button className={styles.plus}>
          <Plus />
        </button>
      </div>
    </>
  );
}

export default CreateHashtags;
