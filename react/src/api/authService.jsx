import httpClient from "../utils/httpClient";
import {API_URL} from "../utils/constants";
import { populateFormData } from "../utils/helpers";

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

  signup(data) {
    const form = populateFormData(data);
    return httpClient.post(`${API_URL}/signup`, form);
  }

  is_user(email) {
    return httpClient.post(`${API_URL}/is_user`, { email });
  }
}

export default new AuthService();
