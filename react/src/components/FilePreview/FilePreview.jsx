import IconButton from "../IconButton/IconButton";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import styles from "./FilePreview.module.css";
import ArrowCycle from "../../assets/arrow-cycle.svg?react";
import { getFile } from "../UploadVideo/UploadVideo";
import { useRef } from "react";

function FilePreview({ file, setVideo }) {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const files = e.target.files;
    const file = getFile(files);
    setVideo(file);
  }

  const handleClick = (e) => {
    e.preventDefault()
    fileRef.current.click()
  };

  return (
    <div className={styles.container}>
      <h2>{file.name}</h2>
      <VideoPlayer url={file.url} />
      <IconButton Icon={ArrowCycle} text="Replace" onClick={handleClick} />
      <input
        type="file"
        id="file"
        accept=".mp4"
        className="hide"
        onChange={handleChange}
        ref={fileRef}
      />
    </div>
  );
}

export default FilePreview;
