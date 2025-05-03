import styles from "./CreatePage.module.css";
import { API_URL } from "../../utils/constants";
import httpClient from "../../utils/httpClient";

function CreatePage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    console.log(form)
    httpClient.post(`${API_URL}/edit`, form)
  }

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Create Page</h1>
        <input type="file" name="video"/>
        <input type="text" name="caption" maxLength="100"/>
        <button>CLICK ME</button>
      </form>
    </>
  );
}

export default CreatePage;
