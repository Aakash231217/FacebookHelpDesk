import React from "react";
import { Outlet } from "react-router-dom";

const CustomRouteLayout = ({ ...rest }) => {
  return <Outlet />;
};

export default CustomRouteLayout;
