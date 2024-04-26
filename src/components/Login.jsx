import React, { useEffect, useState } from "react";
import Card from "./CommonComponents/Card";
import Button from "./CommonComponents/Button";
import { Link, useNavigate } from "react-router-dom";
import { Api, resetApiHeaders } from "../Api/Axios";
import { showError, showSuccess } from "../lib/utils";
import { useAuth } from "../hooks/auth";

const Login = () => {
  const [loginData, setLoginData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value.trim() }));
    setErrorMessage("");
  };

  const loginFunc = async () => {
    setIsLoading(true);
    await Api.post("/auth/login", loginData)
      .then((res) => {
        const token = res.data.token;
        const userData = res.data.user;
        localStorage.setItem("AUTH_TOKEN", token);
        resetApiHeaders(token);
        auth.setLoggedIn(true);
        auth.setUserData(userData);
        showSuccess("Login successful");
        navigate("/connect-page");
      })
      .catch((err) => {
        setIsLoading(false);
        showError(err?.response?.data?.message);
      });
    setIsLoading(false);
  };
  useEffect(() => {
    document.title = "Login - Richpanel Assessment";
  }, []);

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw] bg-primary">
      <Card>
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="font-semibold text-lg">Login to your account</h1>

          <form
            className="flex flex-col gap-5 text-md w-[350px]"
            onSubmit={(e) => {
              e.preventDefault();
              loginFunc();
            }}
          >
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="border-2 rounded-md p-2 w-full"
                placeholder="Please enter your email address"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                required
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="border-2 rounded-md p-2 w-full"
                placeholder="Please enter your password"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Remember Me</span>
            </div>
            <Button type="submit" disabled={isLoading} loading={isLoading}>
              Login
            </Button>
          </form>

          <p className="text-sm mt-4">
            New to MyApp?{" "}
            <Link to="/signup" className="text-primary font-semibold">
              {" "}
              Sign Up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
