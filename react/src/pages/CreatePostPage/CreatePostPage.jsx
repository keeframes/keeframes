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
  const [hashtag, setHashtag] = useState(null);
  const [details, setDetails] = useState({
    caption: "",
    hashtags: ["amv", "edit", "tests",],
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    httpClient.post(`${API_URL}/edit`, form)
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
          
        </section>
      </div>
    </>
  );
}

export default CreatePage;
