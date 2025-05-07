import { API_URL } from "../utils/constants";
import httpClient from "../utils/httpClient";

export async function fetchProfile(username, currentUsername=null) {
  try {
    // appends currentUsername if it is passed
    const url = currentUsername ? `?currentUsername=${currentUsername}` : ""

    const response = await httpClient.get(`${API_URL}/user/profile/${username}${url}`);
    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error("PROFILE_NOT_FOUND");
    }

    if (error.status === 500) {
      throw new Error("Internal server error")
    }

    throw new Error("Error fetching profile for user " + username)
  }
}

export async function followUser(username=null, id=null) {
  try {
    if (username) {
      const response = await httpClient.post(`${API_URL}/user/follow?username=${username}`);
      return response.data;
    }

    if (id) {
      const response = await httpClient.post(`${API_URL}/user/follow?id=${id}`);
      return response.data;
    }
  } catch (error) {
    throw new Error(error.error)
  }
}


export async function unfollowUser(username=null, id=null) {
  try {
    if (username) {
      const response = await httpClient.delete(`${API_URL}/user/unfollow?username=${username}`);
      return response.data;
    }

    if (id) {
      const response = await httpClient.delete(`${API_URL}/user/unfollow?id=${id}`);
      return response.data;
    }
  } catch (error) {
    throw new Error(error.error)
  }
}
