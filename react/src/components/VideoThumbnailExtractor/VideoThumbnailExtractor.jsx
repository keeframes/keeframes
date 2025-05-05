import styles from "./VideoThumbnailExtractor.module.css";
import ArrowCycle from "../../assets/arrow-cycle.svg?react";
import IconButton from "../IconButton/IconButton";
import Picture from "../../assets/picture.svg?react";
import { getFile } from "../UploadVideo/UploadVideo";
import { useRef } from "react";

function VideoThumbnailExtractor({ file, setVideo, setThumbnail }) {
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleChange = (e) => {
    const files = e.target.files;
    const file = getFile(files);
    setVideo(file);
  };

  const handleClick = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const captureThumbnail = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    video.currentTime = 0.1;

    const handleSeeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL("image/png");
      setThumbnail(dataURL);

      video.removeEventListener("seeked", handleSeeked);
    };

    video.addEventListener("seeked", handleSeeked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <h2>{file.name}</h2>
        <video
          className={styles.edit}
          src={file.url}
          ref={videoRef}
          crossOrigin="anonymous"
          preload="metadata"
          onLoadedMetadata={captureThumbnail}
          controls
        />
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
      <div className={styles.row}>
        <h2>Thumbnail</h2>
        <canvas ref={canvasRef} className={styles.thumbnail} />
        <IconButton Icon={Picture} text="Select Thumbnail" onClick={handleClick} />
        <input
          type="file"
          id="file"
          accept=".mp4"
          className="hide"
          onChange={handleChange}
          ref={fileRef}
        />
      </div>
    </div>
  );
}

export default VideoThumbnailExtractor;
