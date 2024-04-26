import React, { useEffect, useState } from "react";
import Card from "./CommonComponents/Card";
import Button from "./CommonComponents/Button";
import { Link, useNavigate } from "react-router-dom";
import { Api, resetApiHeaders } from "../Api/Axios";
import { showError, showSuccess } from "../lib/utils";
import { useAuth } from "../hooks/auth";
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [singupData, setSignupData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSignupData((prev) => ({ ...prev, [id]: value.trim() }));
    setErrorMessage("");
  };
  const auth = useAuth();
  const navigate = useNavigate();

  const signupFunc = async () => {
    setIsLoading(true);
    await Api.post("/auth/signup", singupData)
      .then((res) => {
        const token = res.data.token;
        const userData = res.data.user;
        localStorage.setItem("AUTH_TOKEN", token);
        resetApiHeaders(token);
        auth.setLoggedIn(true);
        auth.setUserData(userData);
        showSuccess("Signup successful");
        navigate("/connect-page");
      })
      .catch((err) => {
        setIsLoading(false);
        showError(err?.response?.data?.message);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    document.title = "Signup - Richpanel Assessment";
  }, []);

  return (
    <div className="flex items-center justify-center h-[100vh] w-[100vw] bg-primary">
      <Card>
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="font-semibold text-lg">Create Account</h1>

          <form
            className="flex flex-col gap-5 text-md w-[350px]"
            onSubmit={(e) => {
              e.preventDefault();
              signupFunc();
            }}
          >
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="name"
                className="border-2 rounded-md p-2 w-full"
                placeholder="Please enter your name"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                required
              />
            </div>
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
                minLength={6}
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
              Sign Up
            </Button>
          </form>

          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
