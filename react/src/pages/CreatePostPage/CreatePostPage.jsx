import styles from "./CreatePage.module.css";
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";
import UploadVideo from "../../components/UploadVideo/UploadVideo";
import { useState } from "react";
import { useEffect } from "react";
import DetailsForm from "../../components/DetailsForm/DetailsForm";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer"
import FilePreview from "../../components/FilePreview/FilePreview";

function CreatePage() {
  const [video, setVideo] = useState(null);
  const [details, setDetails] = useState({
    caption: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    console.log(form)
    httpClient.post(`${API_URL}/edit`, form)
  }

  useEffect(() => {
    console.log(video);
  }, [video])

  return (
    <>
      <div className={styles.container}>
        <section className={styles.videoSection}>
          {video ? 
            <>
              <FilePreview file={video} setVideo={setVideo}/>
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
