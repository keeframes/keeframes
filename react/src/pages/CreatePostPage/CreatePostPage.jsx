import styles from "./CreatePage.module.css";
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import UploadVideo from "../../components/UploadVideo/UploadVideo";
import { useState } from "react";
import DetailsForm from "../../components/DetailsForm/DetailsForm";
import VideoThumbnailExtractor from "../../components/VideoThumbnailExtractor/VideoThumbnailExtractor";

function CreatePage() {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [details, setDetails] = useState({
    caption: "",
    hashtags: ["amv", "edit", "tests",],
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData()
    form.append("video", video)
    form.append("thumbnail", thumbnail)
    console.log(thumbnail)
    form.append("caption", details.caption)
    httpClient.post(`${API_URL}/edit/thumbnail_test`, form)
  }

  return (
    <>
      <div className={styles.container}>
        <section className={styles.videoSection}>
          {video ? 
            <>
              <VideoThumbnailExtractor
                file={video}
                setVideo={setVideo}
                thumbnail={thumbnail}
                setThumbnail={setThumbnail}
              />
            </>
            :
            <UploadVideo setVideo={setVideo}/>
          }
        </section>
        <section className={styles.formSection}>
          <DetailsForm values={details} setValues={setDetails}/>
          
      <button onClick={handleSubmit}>THUMBNAIL TESTER</button>
        </section>
      </div>
    </>
  );
}

export default CreatePage;
