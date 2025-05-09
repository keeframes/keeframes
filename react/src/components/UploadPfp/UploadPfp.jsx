import { useRef } from "react";
import { useSignUp } from "../../hooks/contexts";
import styles from "./UploadPfp.module.css";
import { getFile } from "../../utils/helpers";

export default function UploadPfp() {
  const { data, setData } = useSignUp();
  const inputRef = useRef(null);

  const handleClick = (e) => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const file = getFile(files, ["image/png", "image/jpg", "image/jpeg"]);
    setData((prev) => ({ ...prev, ["pfp"]: file }));
  };

  return (
    <>
      <div className={styles.container} onClick={handleClick}>
        <img src={data.pfp ? data.pfp.url : null} alt="Upload a profile picture" />
      </div>
      <input
        onChange={handleFileChange}
        ref={inputRef}
        name="pfp"
        className="hide"
        type="file"
      />
    </>
  );
}
