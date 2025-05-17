import {
  API_URL,
  COGNITO_CLIENT_ID,
  COGNITO_PAGE_URL,
  COGNITO_REDIRECT_URI,
} from "../utils/constants";
import httpClient from "../utils/httpClient";

class AuthService {
  // for when the user puts in their details normally
  async signup(email, password, nickname, username) {
    localStorage.removeItem("idToken");
    try {
      const form = new FormData();

      // add fields to form
      form.append("password", password);
      form.append("email", email);
      form.append("username", username);
      form.append("nickname", nickname);

      // send user data to backend to create user in database
      const response = await httpClient.post(`${API_URL}/auth/signup`, form);

      console.log("Sign up successful", response.data);
      return response;
    } catch (error) {
      console.error("Error during sign up", error);
      throw error;
    }
  }

  // for when the user confirms their email
  async confirmSignUp(email, code) {
    const form = new FormData();
    form.append("email", email);
    form.append("code", code);

    try {
      const response = await httpClient.post(
        `${API_URL}/auth/signup/confirm`,
        form,
      );
      console.log("Confirm sign up successful", response.data);
      return response;
    } catch (error) {
      console.error("Error during confirm sign up", error);
      throw error;
    }
  }

  // this resends the signup confirmation code
  async resendConfirmationCode(email) {
    const form = new FormData();
    form.append("email", email);

    try {
      const response = await httpClient.get(
        `${API_URL}/auth/code/resend`,
        form,
      );
      console.log(response.data);
      return response;
    } catch (error) {
      console.error("Error resending confirmation code:", error);
      throw error;
    }
  }

  // lets a user log into the app
  async login(email, password) {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    try {
      const response = await httpClient.post(`${API_URL}/auth/login`, form);
      const idToken = await response.data.idToken;

      if (idToken) {
        // set the JWT token into local storage
        localStorage.setItem("idToken", idToken);
        console.log("Sign-in successful");
      } else {
        throw new Error("No ID token returned");
      }
      return response;
    } catch (error) {
      throw error.response.data;
    }
  }

  async isAuthenticated() {
    try {
      const response = await httpClient.get(`${API_URL}/auth/authenticated`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  googleAuth() {
    const url = `${API_URL}/auth/google`;
    // make a new window
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // open the window at the url
    window.open(
      url,
      "Google Login Window",
      `width=${width},height=${height},top=${top},left=${left},popup=yes`,
    );
  }
}

export default new AuthService();
