import React from "react";
import Icon from "../assets/richpanel_icon.png";
import Inbox from "../assets/inbox.png";
import InboxSelected from "../assets/inbox_selected.png";
import LineChart from "../assets/line_chart.png";
import LineChartSelected from "../assets/line_chart_selected.png";
import Friends from "../assets/friends.png";
import FriendsSelected from "../assets/friends_selected.png";
import { Link } from "react-router-dom";
import DefaultUserImage from "../assets/user.png";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/auth";

const Sidebar = () => {
  const auth = useAuth();
  const sidebarOps = [
    {
      name: "chatportal",
      link: "/helpdesk",
      icon: Inbox,
      iconSelected: InboxSelected,
    },
    {
      name: "manage-page",
      link: "/helpdesk/manage-page",
      icon: Friends,
      iconSelected: FriendsSelected,
    },
    {
      name: "analysis",
      link: "/helpdesk/analysis",
      icon: LineChart,
      iconSelected: LineChartSelected,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-12 p-4 h-full">
      {/* icon */}
      <div className="flex  items-center justify-center w-full">
        <img src={Icon} className="h-8 w-8" />
      </div>

      <div className="flex flex-col gap-10">
        {sidebarOps?.map((op) => (
          <Link to={op?.link} key={op?.name}>
            <img alt={op?.name} src={op?.icon} className="h-6 w-6" />
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-5 items-center mt-auto">
        <LogOut
          color="white"
          className="h-6 w-6 cursor-pointer"
          onClick={() => {
            auth.logout();
          }}
        />
        <div className="relative">
          <img src={DefaultUserImage} alt="user" className="w-8" />
          <div className="h-3 w-3 bg-lime-500 rounded-full absolute right-0 -bottom-[2px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
