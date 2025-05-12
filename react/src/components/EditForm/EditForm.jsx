import styles from "./EditForm.module.css";
import UploadPfp from "../UploadPfp/UploadPfp";

// profile picture, username, name, gender, pronouns, bio, software 

function EditForm() {
    return (
        <main>
            <h1>Edit Profile</h1>
            <section>
                <div className={styles.picture}>
                    <h2>Profile Picture</h2>
                    <UploadPfp />
                </div>

                <div className={styles.username}>
                    <h2>Username</h2>
                    <input type="text" />
                </div>

                <div className={styles.name}>
                    <h2>Name</h2>
                    <input type="text" />
                </div>

                <div className={styles.gender}>
                    <h2>Gender</h2>
                    <select
                        name="gender"
                        required
                        onChange={handleChange}
                        value={data.gender}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="prefer not to say">Prefer not to say</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                


            </section>
        </main>
    )
}

export default EditForm;