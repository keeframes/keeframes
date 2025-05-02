import httpClient from "../utils/httpClient";
import {API_URL} from "../utils/constants";

class AuthService {
  login(email, password) {
    return httpClient.post(`${API_URL}/login`, {
      email,
      password,
    });
  }

  logout() {
    return httpClient.post(`${API_URL}/logout`, {});
  }

  is_authenticated() {
    return httpClient.get(`${API_URL}/is_authenticated`);
  }

  signup(name, username, email, password) {
    return httpClient.post(`${API_URL}/signup`, {
      name,
      username,
      email,
      password,
    });
  }

  is_user(email) {
    return httpClient.post(`${API_URL}/is_user`, { email });
  }
}

export default new AuthService();
