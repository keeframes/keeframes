import styles from "./VideoThumbnailExtractor.module.css";
import ArrowCycle from "../../assets/arrow-cycle.svg?react";
import IconButton from "../IconButton/IconButton";
import Picture from "../../assets/picture.svg?react";
import { useEffect, useRef, useState } from "react";
import { getFile } from "../../utils/helpers";

function VideoThumbnailExtractor({ file, setVideo, thumbnail, setThumbnail }) {
  // the check for whether the user has uploaded custom thumbnail
  const [hasUploadedThumbnail, setHasUploadedThumbnail] = useState(false);

  // references to elements
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // when a new file is uploaded
  const handleVideoUpload = (e) => {
    const files = e.target.files;
    const file = getFile(files, ["video/mp4"]);
    setVideo(file);
  };

  // when a new file is uploaded
  const handleThumbnailUpload = (e) => {
    const files = e.target.files;
    const file = getFile(files, ["image/png", "image/jpg", "image/jpeg"]);
    setThumbnail(file.url);
    setHasUploadedThumbnail(true);
  };

  // when the replace button is pressed
  const handleClick = (e) => {
    e.preventDefault();

    if (e.target.name === "video") {
      videoInputRef.current.click();
    } else {
      thumbnailInputRef.current.click();
    }
  };

  // captures a thumbnail from a video
  const captureThumbnail = () => {
    // checks whether someone has uploaded a video
    if (hasUploadedThumbnail) {
      return;
    }

    // get the elements from the refs
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // this gets the thumbnail from a video
    const handleSeeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // draw an image to the canvas
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // get the thumbnail image from the canvas
      const dataURL = canvas.toDataURL("image/png");
      setThumbnail(dataURL);
    };

    // adds an event listener
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
        <IconButton Icon={ArrowCycle} onClick={handleClick} name="video">
          Replace
        </IconButton>
        <input
          type="file"
          id="file"
          accept=".mp4"
          className="hide"
          onChange={handleVideoUpload}
          ref={videoInputRef}
        />
      </div>
      <div className={styles.row}>
        <h2>Thumbnail</h2>
        <p className={styles.instructions}>
          Seek to change the thumbnail or upload your own.
        </p>
        <div className={styles.thumbnail}>
          <img src={thumbnail} alt="Thumbnail" />
        </div>
        <canvas ref={canvasRef} className={styles.canvas} />
        <IconButton Icon={Picture} onClick={handleClick} name="thumbnail">
          Select Thumbnail
        </IconButton>
        <input
          type="file"
          id="file"
          accept=".png, .jpg"
          className="hide"
          onChange={handleThumbnailUpload}
          ref={thumbnailInputRef}
        />
      </div>
    </div>
  );
}

export default VideoThumbnailExtractor;
