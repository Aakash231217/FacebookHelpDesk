import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth";

const CustomRoute = ({
  element,
  visibleToAuthenticatedUser = true,
  visibleToUnauthenticatedUser = true,
}) => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isInitialised) {
      if (visibleToUnauthenticatedUser === false && auth.isLoggedIn === false) {
        // Redirect to Login page
        navigate("/login");
      } else if (
        visibleToAuthenticatedUser === false &&
        auth.isLoggedIn == true
      ) {
        // Redirect to connect page
        navigate("/connect-page");
      } else if (visibleToAuthenticatedUser && visibleToAuthenticatedUser) {
        // Do nothing and render the page
      }
    }
  }, [auth]);

  return element || null;
};

export default CustomRoute;
