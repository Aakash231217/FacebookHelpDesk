import React from "react";
import loadingSpinner from "../../assets/spinner.gif";

const Button = ({
  children,
  variant = "PRIMARY",
  type,
  disabled,
  className,
  onClick,
  loading = false,
}) => {
  const getColor = () => {
    if (variant === "PRIMARY") {
      return "bg-primary";
    } else if (variant === "DANGER") {
      return "bg-[#E15240]";
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled ? disabled : false}
      type={`${type ? type : "button"}`}
      className={`py-2 px-6 flex justify-center items-center text-md text-white rounded-md ${getColor()}  ${
        disabled
          ? "cursor-not-allowed bg-opacity-80"
          : "cursor-pointer hover:bg-opacity-90 "
      } transition-all duration-150 ${className}`}
    >
      {loading ? <img src={loadingSpinner} className="h-6 w-6" /> : children}
    </button>
  );
};

export default Button;
