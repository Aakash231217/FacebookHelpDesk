import React, { useEffect, useRef, useState, version } from "react";
import { Menu, RotateCw, SendHorizontal, ChevronDown } from "lucide-react";

import { Api, GraphApi } from "../Api/Axios";
import {
  getDate,
  getDuration,
  getTime,
  showError,
  showSuccess,
} from "../lib/utils";
import { useLoader } from "../hooks/loader";
import CustomerInformation from "./CustomerInformation";
import ChatCustomers from "./ChatCustomers";
import ChatDock from "./ChatDock";

const ChatPortal = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const loader = useLoader();
  const socketRef = useRef();

  const getClientDetails = async (chat) => {
    try {
      const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
      const pageDetailsParsed = JSON.parse(pageDetails ? pageDetails : "{}");
      if (!pageDetailsParsed.id) {
        throw new Error("Please connect to a facebook page");
      }

      const clientId = chat?.clientId;
      const res = await GraphApi.get(`/${clientId}`, {
        params: {
          access_token: pageDetailsParsed.pageAccessToken,
          fields: "name,first_name,last_name,profile_pic,email",
        },
      });
      const clientDetails = res.data;
      chat.client = clientDetails;
      return chat;
    } catch (error) {
      const errorCode = error?.response?.data?.error?.code;
      if (errorCode === 190) {
        showError("Access token expired ... please reconnect to facebook page");
        return;
      }
      showError(error?.message);
    }
  };

  const updateChat = async (clientId, senderId, message) => {
    let chatExists = false;
    const updatedChats = chats?.map((c) => {
      if (c?.clientId === clientId) {
        chatExists = true;
        const updatedChat = {
          ...c,
          messages: [
            ...c.messages,
            {
              senderId: senderId,
              message: message,
              time: Date.now(),
            },
          ],
        };
        console.log(updatedChat);
        if (updatedChat?.clientId === selectedChat?.clientId) {
          setSelectedChat(updatedChat);
        }
        return updatedChat;
      }
      return c;
    });

    // If chat does not exist create one
    if (chatExists) {
      setChats(updatedChats);
    } else {
      const newChat = {
        clientId: clientId,
        senderId: clientId,
        messages: [
          {
            senderId: senderId,
            message: message,
            time: Date.now(),
          },
        ],
      };

      // console.log(newChat);
      const newChatWithDetails = await getClientDetails(newChat);
      // console.log(newChatWithDetails);
      setChats((prev) => [...prev, newChatWithDetails]);
    }
  };

  const getAllMessages = async () => {
    loader.setLoading(true);
    try {
      const pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
      const pageDetailsParsed = JSON.parse(pageDetails ? pageDetails : "{}");
      if (!pageDetailsParsed.id) {
        throw new Error("Please connect to a facebook page");
      }
      const res = await Api.get("/messages/getAllMessages", {
        params: { pageId: pageDetailsParsed.id },
      });

      const allChats = res.data.messages;
      // Fetch client details for each sender
      const allChatsNamedPromises = allChats?.map((chat) => {
        return getClientDetails(chat);
      });

      const __chats = await Promise.all(allChatsNamedPromises);
      setChats(__chats);
    } catch (error) {
      loader.setLoading(false);
      showError(error?.message);
      return;
    }
    loader.setLoading(false);
  };
  const selectAChat = (chat) => {
    setSelectedChat(chat);
  };

  // Functions for socket connection and handling receive message

  const joinChat = (pageId) => {
    try {
      const payload = { action: "join-chat", pageId: pageId };
      socketRef.current.send(JSON.stringify(payload));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceiveMessage = (payload) => {
    console.log("Message received");
    if (!payload.senderId) {
      return;
    }
    const { senderId, pageId, message, created_at } = payload;
    updateChat(senderId, senderId, message);
  };

  const handleInitConfirmation = (payload) => {
    loader.setLoading(false);
    if (payload.status === 400) {
      showError(payload?.message);
    }
  };

  const initSocket = () => {
    const ENDPOINT = import.meta.env.VITE_SOCKET_ENDPOINT;
    const __pageDetails = localStorage.getItem("FB_PAGE_DETAILS");
    let pageDetails = {};
    if (__pageDetails && __pageDetails !== "") {
      pageDetails = JSON.parse(__pageDetails);
      const pageId = pageDetails?.id;
      socketRef.current = new WebSocket(ENDPOINT);
      socketRef.current.onopen = () => {
        joinChat(pageId);
        loader.setLoading(true);
      };
    }
  };

  if (socketRef.current) {
    socketRef.current.onmessage = (res) => {
      const payload = JSON.parse(res.data);
      if (payload?.action === "message") {
        handleReceiveMessage(payload);
      } else if (payload?.action === "socket-init-confirmation") {
        handleInitConfirmation(payload);
      }
    };
  }

  useEffect(() => {
    if (!socketRef.current) {
      initSocket();
    }
    getAllMessages();
  }, []);

  return (
    <div className="flex w-full justify-between overflow-hidden">
      {/* Customers will be shown here */}
      <div className="flex flex-col min-w-[180px]  w-[20%] border-r">
        <div className="overflow-hidden border-b border-black flex items-center justify-between p-3 opacity-65 gap-10">
          <div className="flex items-center gap-2 ">
            <Menu className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Conversations</h1>
          </div>
          <RotateCw
            className="h-6 w-6 cursor-pointer"
            onClick={() => {
              getAllMessages();
            }}
          />
        </div>

        <ChatCustomers chats={chats} selectAChat={selectAChat} />
      </div>

      {selectedChat ? (
        <>
          {/* Main chat section */}
          <ChatDock chat={selectedChat} updateChat={updateChat} />
          {/* Personal Info */}

          <div className="w-[22%]">
            <CustomerInformation chat={selectedChat} />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ChatPortal;
