import styles from "./ProfileDetails.module.css";
import { CDN_URL } from "../../utils/constants";
import Count from "../../components/Count/Count";
import { followUser, unfollowUser } from "../../api/user";
import { useParams } from "react-router-dom";
import { createContext } from "react";

const ProfileDetailsContext = createContext(null);

function useProfileDetailsContext() {
  const context = useContext(ProfileDetailsContext);
  if (!context) {
    throw new Error("useProfileDetailsContext must be used within a ProfileDetails")
  }
  return context;
}

export default function ProfileDetails({ profile, setProfile, children }) {
  return (
    <ProfileDetailsContext values={{ profile, setProfile }}>
      <div className={styles.profile}>
        <div className={styles.details}>
          <div className={styles.pfp}>
            <img src={`${CDN_URL}/static/pfp/default.jpg`} />
          </div>
          <div className={styles.content}>
            <div className={styles.info}>
              <div className={styles.header}>
                <h1>{profile.name}</h1>
                <p className={styles.pronouns}>{profile.pronouns}</p>
              </div>
              <p className={styles.username}>@{profile.username}</p>
              <p className={styles.bio}>{profile.bio}</p>
              <div className={styles.buttons}>{children}</div>
              <p className={styles.est}>{profile.est}</p>
            </div>
            <div className={styles.counts}>
              <Count label="Posts" number={profile.edit_count} />
              <Count label="Followers" number={profile.follower_count} />
              <Count label="Following" number={profile.following_count} />
            </div>
          </div>
        </div>
      </div>
    </ProfileDetailsContext>
  );
}

ProfileDetails.FollowButton = function FollowButton() {
  const { username } = useParams();

  const handleClick = async () => {
    await followUser(username);
  };

  return (
    <button className={styles.follow} onClick={handleClick}>
      Follow
    </button>
  );
};

ProfileDetails.UnfollowButton = function UnfollowButton() {
  const { username } = useParams();

  const handleClick = async () => {
    await unfollowUser(username);
  };

  return (
    <button className={styles.unfollow} onClick={handleClick}>
      Following
    </button>
  );
};

ProfileDetails.MessageButton = function MessageButton() {
  return <button className={styles.message}>Message</button>;
};


ProfileDetails.EditButton = function EditButton() {
  return <button className={styles.edit}>Edit Profile</button>;
};
