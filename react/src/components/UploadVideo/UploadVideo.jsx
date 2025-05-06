import styles from "./UploadVideo.module.css";
import { getFile } from "../../utils/helpers";

function UploadVideo({ setVideo }) {
  // when you drop a file over the area
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = getFile(files, ["video/mp4"]);
    setVideo(file);
  };

  // prevents the file from opening when dragging it
  const handleDrag = (e) => {
    e.preventDefault();
  };

  // if you use a button to upload a file
  const handleChange = (e) => {
    const files = e.target.files;
    const file = getFile(files, ["video/mp4"]);
    setVideo(file);
  };

  return (
    <>
      <div
        className={styles.container}
        onDrop={handleDrop}
        onDragOver={handleDrag}
      >
        <h2 className={styles.header}>Drag an edit here</h2>
        <button className={styles.upload}>
          <label className={styles.label} htmlFor="file">
            Select from device
          </label>
        </button>
        <input
          type="file"
          id="file"
          accept=".mp4"
          className="hide"
          onChange={handleChange}
        />
      </div>
    </>
  );
}

export default UploadVideo;
