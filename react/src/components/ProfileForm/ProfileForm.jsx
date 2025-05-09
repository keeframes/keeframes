import styles from "./ProfileForm.module.css";
import { useSignUp } from "../../hooks/contexts";
import UploadPfp from "../UploadPfp/UploadPfp";
import { fetchAllSoftware } from "../../api/software";
import { useQuery } from "@tanstack/react-query";
import profileSchema from "../../validation/profileValidation";

export default function ProfileForm() {
  const { data, handleChange, error, setError } = useSignUp();
  const { data: software, isLoading } = useQuery({
    queryFn: () => fetchAllSoftware("official"),
    queryKey: ["get", "all", "software"],
    staleTime: Infinity,
  });

  // shows appropriate error based on error state
  const Errors = () => {
    if (!error) return;

    return <p className="error">{error}</p>;
  };

  return (
    <>
      <h1>Profile Details</h1>
      <Errors />
      <div className={`${styles.pfp} form-row`}>
        <UploadPfp />
      </div>
      <div className="form-row">
        <label htmlFor="bio">Bio</label>
        <textarea
          cols="1"
          rows="2"
          maxLength="150"
          name="bio"
          onChange={handleChange}
          value={data.bio}
        />
      </div>
      <div className="form-row">
        <label htmlFor="software">Software</label>
        <select
          name="software"
          value={data.software}
          required
          onChange={handleChange}
        >
          {!isLoading &&
            software.map((s, index) => (
              <option key={index} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}

ProfileForm.validate = function validate(data) {
  try {
    profileSchema.parse(data);
  } catch (error) {
    if (error.errors) {
      throw new Error(error.errors[0].message);
    }

    throw error;
  }
};
