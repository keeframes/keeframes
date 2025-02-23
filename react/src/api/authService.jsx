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

  signup(email, password) {
    return httpClient.post(`${API_URL}/signup`, {
      email,
      password,
    });
  }

  is_user(email) {
    return httpClient.post(`${API_URL}/is_user`, { email });
  }
}

export default new AuthService();
