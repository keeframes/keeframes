import styles from "./ProfileDetails.module.css";
import { CDN_URL } from "../../utils/constants";
import Count from "../../components/Count/Count";
import { followUser, unfollowUser } from "../../api/user";
import { useParams } from "react-router-dom";
import { createContext, use } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ProfileDetails({ profile, setProfile, children }) {
  return (
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
  );
}

ProfileDetails.FollowButton = function FollowButton() {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => followUser(username),
    onSuccess: () => {
      queryClient.setQueryData(["profile", username], (old) => {
        if (!old) return old;

        return {
          ...old,
          follower_count: old.follower_count + 1,
          is_following: true,
        };
      });
    },
  });

  const handleClick = (e) => {
    followMutation.mutate();
  };

  return (
    <button className={styles.follow} onClick={handleClick}>
      Follow
    </button>
  );
};

ProfileDetails.UnfollowButton = function UnfollowButton() {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const handleClick = (e) => {
    unFollowMutation.mutate();
  };

  const unFollowMutation = useMutation({
    mutationFn: () => unfollowUser(username),
    onSuccess: () => {
      queryClient.setQueryData(["profile", username], (old) => {
        if (!old) return old;

        return {
          ...old,
          follower_count: old.follower_count - 1,
          is_following: false,
        };
      });
    },
  });

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
