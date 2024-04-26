import React, { useEffect, useState } from "react";
import Card from "./CommonComponents/Card";
import Button from "./CommonComponents/Button";
import { useAuth } from "../hooks/auth";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GraphApi } from "../Api/Axios";
import { showError, showSuccess } from "../lib/utils";
import { Link } from "react-router-dom";
const FBConnectPage = () => {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const auth = useAuth();

  const facebookAppID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const facebookRedirectURI = import.meta.VITE_PUBLIC_URL_ENCODED;

  const getPageId = async (accessToken) => {
    setLoading(true);
    try {
      const res = await GraphApi.get("/me/accounts", {
        params: { access_token: accessToken },
      });
      const pageObj = {
        name: res?.data?.data[0]?.name,
        id: res?.data?.data[0]?.id,
        pageAccessToken: res?.data?.data[0]?.access_token,
      };

      localStorage.setItem("FB_PAGE_ID", pageObj?.id);
      localStorage.setItem("FB_PAGE_ACCESS_TOKEN", pageObj.pageAccessToken);
      localStorage.setItem("FB_PAGE_DETAILS", JSON.stringify(pageObj));
      showSuccess(`Connected to Facebook page ${pageObj?.name}`);
      setIsConnected(true);
    } catch (error) {
      setLoading(false);
      showError("Could not connect to the Facebook page");
      localStorage.removeItem("FB_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ID");
    }
    setLoading(false);
  };

  const responseFacebook = async (data) => {
    setLoading(true);
    try {
      if (data.accessToken) {
        const accessToken = data.accessToken;
        localStorage.setItem("FB_ACCESS_TOKEN", accessToken);
        await getPageId(accessToken);
      }
    } catch (error) {
      setLoading(false);
      showError("Could not connect to the Facebook page");
      localStorage.removeItem("FB_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
      localStorage.removeItem("FB_PAGE_ID");
    }
    setLoading(false);
  };

  const deleteConnection = () => {
    setLoading(true);
    localStorage.removeItem("FB_PAGE_DETAILS");
    localStorage.removeItem("FB_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_ACCESS_TOKEN");
    localStorage.removeItem("FB_PAGE_ID");
    setIsConnected(false);
    setLoading(false);
  };

  const checkPageConnected = () => {
    const accessToken = localStorage.getItem("FB_ACCESS_TOKEN");
    if (
      accessToken !== null &&
      accessToken !== undefined &&
      accessToken !== ""
    ) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    document.title = "Connect Page - Richpanel Assessment";
    checkPageConnected();
  }, []);

  return (
    <div className="h-[100vh] w-[100vw] bg-primary flex justify-center items-center">
      <Card>
        <div className="flex flex-col items-center justify-center w-[300px] gap-7">
          <h1 className="font-semibold text-lg">Facebook Page Integration</h1>
          {isConnected ? (
            <>
              <div className="w-full flex flex-col gap-3">
                <Button
                  onClick={deleteConnection}
                  variant="DANGER"
                  loading={loading}
                >
                  Delete Integration
                </Button>
                <Link className="w-full" to="/helpdesk">
                  <Button className="w-full">Reply To Messages</Button>
                </Link>
              </div>
            </>
          ) : (
            // <Button className="w-full">Connect Page</Button>
            <FacebookLogin
              appId={facebookAppID}
              redirectUri={facebookRedirectURI}
              scope="pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata"
              callback={responseFacebook}
              onFailure={() => {
                showError("Could not connect to the Facebook page");
              }}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  loading={loading}
                  className="w-full"
                >
                  Connect Page
                </Button>
              )}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default FBConnectPage;
