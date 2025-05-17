import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/contexts";
import httpClient from "../../utils/httpClient";
import { API_URL } from "../../utils/constants";

function Callback() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const getToken = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const idToken = params.get("id_token");

      if (idToken && window.opener) {
        // Send token back to main window
        window.opener.postMessage(
          { type: "oauth-success", idToken },
          window.location.origin,
        );

        // Optional: delay to ensure message is sent
        setTimeout(() => window.close(), 500);
      }
    };

    getToken();
  }, [navigate]);
}

export default Callback;
