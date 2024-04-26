import React from "react";
import Card from "./CommonComponents/Card";
import Button from "./CommonComponents/Button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-primary h-[100vh] w-[100vw] flex justify-center items-center">
      <Card>
        <div className="flex flex-col justify-center items-center w-[300px] gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-lg">Richpanel Assignment Facebook Helpdesk</h1>
            <span>Aakash Singh</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Landing;
