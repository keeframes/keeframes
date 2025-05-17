import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  API_URL,
  COGNITO_CLIENT_ID,
  COGNITO_PAGE_URL,
  COGNITO_REDIRECT_URI,
} from "../utils/constants";
import httpClient from "../utils/httpClient";

class AuthService {
  constructor(region = "eu-west-2") {
    this.client = new CognitoIdentityProviderClient({ region });
    this.clientId = COGNITO_CLIENT_ID;
  }

  // for when the user puts in their details normally
  async signup(email, password, nickname, username) {
    // the cognito sign up command
    const command = new SignUpCommand({
      ClientId: this.clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });

    try {
      // send command to the cognito client
      const response = await this.client.send(command);
      const form = new FormData();

      // add fields to form
      form.append("sub", response.UserSub);
      form.append("email", email);
      form.append("username", username);
      form.append("nickname", nickname);

      // send user data to backend to create user in database
      await httpClient.post(`${API_URL}/signup`, form);

      console.log("Sign up successful", response);
      return response;
    } catch (error) {
      console.error("Error during sign up", error);
      throw error;
    }
  }

  // for when the user confirms their email
  async confirmSignUp(email, code) {
    // this will handle the cognito confirm email code
    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    });

    // runs the command
    try {
      const response = await this.client.send(command);
      console.log("Confirm sign up successful", response);
      return response;
    } catch (error) {
      console.error("Error during confirm sign up", error);
      throw error;
    }
  }

  // this resends the signup confirmation code
  async resendConfirmationCode(email) {
    const command = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      Username: email,
    });

    try {
      const response = await this.client.send(command);
      console.log("Confirmation code resent:", response);
      return response;
    } catch (error) {
      console.error("Error resending confirmation code:", error);
      throw error;
    }
  }

  // lets a user log into the app
  async login(email, password) {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const response = await this.client.send(command);
      const idToken = response.AuthenticationResult?.IdToken;
      if (idToken) {
        // set the JWT token into local storage
        localStorage.setItem("idToken", idToken);
        console.log("Sign-in successful");
      } else {
        throw new Error("No ID token returned");
      }
      return response;
    } catch (error) {
      console.error("Error during sign-in:", error);
      throw error;
    }
  }

  async isAuthenticated() {
    try {
      const response = await httpClient.get(`${API_URL}/is_authenticated`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  googleAuth() {
    // build the url for the signup page
    const url = COGNITO_PAGE_URL + "/oauth2/authorize";
    const identity_provider = "?identity_provider=Google";
    const response_type = "&response_type=token";
    const client_id = `&client_id=${this.clientId}`;
    const redirect_uri = `&redirect_uri=${COGNITO_REDIRECT_URI}`;
    const scope = `&scope=email+openid+profile`;

    // make a new window
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    // combine the url
    const complete_url =
      url +
      identity_provider +
      response_type +
      client_id +
      redirect_uri +
      scope;

    // open the window at the url
    window.open(
      complete_url,
      "Google Login Window",
      `width=${width},height=${height},top=${top},left=${left},popup=yes`,
    );
  }
}

export default new AuthService();
