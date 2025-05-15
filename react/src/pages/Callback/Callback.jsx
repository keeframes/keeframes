import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
  const navigate = useNavigate();
  const ran = useRef(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (ran.current) return;
      ran.current = true;
    const testFunc = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get("id_token");

      if (idToken) {
        try {
          const response = await axios.post(
            "http://localhost:8000/signup/google",
            {}, // or user info if you're passing anything
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          setUser(response.data)

          console.log(response.data);

          localStorage.setItem("idToken", idToken);
        } catch (error) {
          console.error("Signup failed:", error);
        }
      }
    };

    testFunc();
  }, [navigate]);

  return <div><img src={user?.profile_url}/></div>;
}

export default Callback;


