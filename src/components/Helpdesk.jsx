import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const Helpdesk = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    document.title = "Helpdesk - Richpanel Assessment";
    const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
    if (!pageDetails || pageDetails === "") {
      navigate("/connect-page");
    } else {
      const pageDetailsParsed = JSON.parse(pageDetails);
      if (!pageDetailsParsed?.id) {
        navigate("/connect-page");
      }
    }

    const timeoutId = setTimeout(() => {
      if (!auth.isLoggedIn) {
        navigate("/connect-page");
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [auth]);

  return (
    <div className="flex h-[100vh] w-[100vw]">
      {/* Sidebar navigation */}
      <div className="flex flex-col w-[5%] min-w-[60px] bg-primary">
        <Sidebar />
      </div>

      {/* Main work section dock (Changable) */}
      <div className="flex w-[95%]">
        <Outlet />
      </div>
    </div>
  );
};

export default Helpdesk;
