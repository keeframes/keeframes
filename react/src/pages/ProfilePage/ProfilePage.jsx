import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { CDN_URL } from "../../utils/constants";
import Count from "../../components/Count/Count";

export default function ProfilePage() {
  const { username } = useParams();

  return (
    <section className={styles.container}>
      <div className={styles.profile}>
        <div className={styles.details}>
          <div className={styles.pfp}>
            <img src={`${CDN_URL}/static/pfp/default.jpg`} />
          </div>
          <div className={styles.content}>
            <div className={styles.info}>
              <div className={styles.header}>
                <h1>Chris</h1>
                <p className={styles.pronouns}>he/him</p>
              </div>
              <p className={styles.username}>@_rentengen</p>
              <p className={styles.bio}>
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
                massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                sapien fringilla, mattis ligula consectetur, ultrices mauris.
              </p>
              <div className={styles.buttons}>
                <button className={styles.follow}>Follow</button>
                <button className={styles.message}>Message</button>
              </div>
              <p className={styles.est}>est. JAN 2025</p>
            </div>
            <div className={styles.counts}>
              <Count label="Posts" number={20} />
              <Count label="Followers" number={20} />
              <Count label="Following" number={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
