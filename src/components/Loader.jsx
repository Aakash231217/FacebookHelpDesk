import React from "react";
import Card from "./CommonComponents/Card";
import spinner from "../assets/spinner2.gif";
const Loader = () => {
  return (
    <div className="absolute top-0 left-0 h-[100vh] w-[100vw]  bg-black bg-opacity-60 flex items-center justify-center loading-container">
      <Card>
        <div className="flex flex-col items-center justify-center">
          <img src={spinner} className="h-10 w-10" />
          <span className="text-2xl">Loading</span>
        </div>
      </Card>
    </div>
  );
};

export default Loader;
