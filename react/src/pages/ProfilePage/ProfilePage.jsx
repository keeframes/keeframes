import { useParams } from "react-router-dom";
import ProfileDetails from "../../components/ProfileDetails/ProfileDetails";
import { useCurrentUser } from "../../hooks/contexts";
import styles from "./ProfilePage.module.css";
import { fetchProfile } from "../../api/user";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const { user } = useCurrentUser();
  const { username } = useParams();

  const {
    data: profile,
    isLoading,
    isError,
    error,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username, user.username),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }

  if (isError) {
    if (error.message === "PROFILE_NOT_FOUND") {
      return <div>PROFILE NOT FOUND</div>;
    }
    return <div>Error</div>;
  }

  const SelectedButtons = () => {
    // if this profile page is the current user's
    if (user.username === username) {
      return (
        <>
          <ProfileDetails.EditButton />
        </>
      );
    }

    // if the user is following the profile
    if (profile.is_following) {
      return (
        <>
          <ProfileDetails.UnfollowButton />
          <ProfileDetails.MessageButton />
        </>
      );
    }

    // if the user is not following the profile
    return (
      <>
        <ProfileDetails.FollowButton />
        <ProfileDetails.MessageButton />
      </>
    );
  };

  return (
    <section className={styles.container}>
      <ProfileDetails profile={profile}>
        <SelectedButtons />
      </ProfileDetails>
    </section>
  );
}
