import styles from "./EditForm.module.css";
import PronounsSelect from "../PronounsSelect/PronounsSelect";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/contexts";
import httpClient from "../../utils/httpClient";
import { API_URL } from "../../utils/constants";

// profile picture, username, name, gender, pronouns, bio, software 



function EditForm() {

    const user = useCurrentUser(); 

    const [values, setValues] = useState({
        username: user.username,
        name: user.name,
        gender: user.gender,
        pronouns: user.pronouns, 
    });

    useEffect(() => {
        if (user) {
            setValues({
                username: user.username || "",
                name: user.name || "",
                gender: user.gender || "",
                pronouns: user.pronouns || "",
                bio: user.bio || "",
                software: user.software || ""
            });
        }
    }, [user])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setValues((prev) => ({...prev, [name]: value}));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await httpClient.patch(`${API_URL}/user/edit`);
        }
        catch {
            console.log("error updating profile: ", error);
        }

    }

    return (
        <main>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.picture}>
                    <label htmlFor="pfp">Profile Picture</label>
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="gender">Gender</label>
                    <select
                        name="gender"
                        onChange={handleChange}
                        value={values.gender}
                        required
                    >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer not to say">Prefer not to say</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="pronouns">Pronouns</label>
                    <PronounsSelect data={values} onChange={handleChange} />
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        name="bio"
                        value={values.bio}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formrow}>
                    <label htmlFor="software">Software</label>
                    <input
                        type="text"
                        name="software"
                        value={values.software}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    Save Changes
                </button>
            </form>
        </main>
    );
}

export default EditForm;
