import { getDuration } from "../lib/utils";
import Conversation from "../assets/conversation.jpg";
const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80%] opacity-60">
      <img src={Conversation} alt="Empty conversation" className="h-32 w-32" />
      <span>No conversation has started yet.</span>
    </div>
  );
};

const ChatCustomers = ({ chats, selectAChat }) => {
  const getLastMessageTime = (chat) => {
    const lastMessageTime = chat?.messages[chat.messages.length - 1]?.time;
    return getDuration(lastMessageTime);
  };

  const getLastMessage = (chat) => {
    const lastMessage = chat?.messages[chat.messages.length - 1]?.message;
    return lastMessage;
  };

  if (chats.length === 0) {
    return <EmptyChat />;
  }
  return (
    <div className="flex flex-col items-start">
      {chats?.map((chat, i) => {
        return (
          <div
            className="flex flex-col p-4 w-full border-b cursor-pointer  hover:bg-[#F6F6F6] transition-all duration-200"
            key={i}
            onClick={() => {
              selectAChat(chat);
            }}
          >
            <div className="flex w-full items-center gap-3">
              <input type="checkbox" className="h-4 w-4" />
              <div className="flex flex-col items-start w-[80%]">
                <span className="max-w-[100%] overflow-hidden text-left">
                  {chat?.client?.name}
                </span>
                <span className="text-sm opacity-70">Facebook DM</span>
              </div>
              <span className="text-sm mb-4 opacity-60">
                {getLastMessageTime(chat)}
              </span>
            </div>

            <div className="mr-auto text-left">
              <span className="text-sm opacity-60 text-left">
                {getLastMessage(chat)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatCustomers;
