import axios from "axios"; // library for HTTP requests

// creates an axios instance with setting
export default axios.create({
  withCredentials: true, // ensures cookies(session tokens) are send with request
});
