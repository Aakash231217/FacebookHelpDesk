const connectToDatabase = require("../../Database/db");
const Message = require("../../Models/Message");

const { sendError, sendResponse } = require("../../Utils/response");

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const db = await connectToDatabase();
  } catch (err) {
    return sendError(err.statusCode, err);
  }
  try {
    const queryParams = event.queryStringParameters;
    const pageId = queryParams.pageId;
    if (!pageId || pageId === "") {
      throw new Error("Please provide a valid page id");
    }

    const allMessages = await Message.find({ pageId: pageId });
    //   Group by senders

    const messagesGroupedBySenders = allMessages.reduce((acc, item) => {
      if (!acc[item.clientId]) {
        acc[item.clientId] = {
          clientId: item.clientId,
          pageId: item.pageId,
          messages: [],
        };
      }
      acc[item.clientId].messages.push({
        message: item.message,
        senderId: item.senderId,
        time: item.created_at,
      });
      return acc;
    }, {});
    const payload = Object.values(messagesGroupedBySenders);
    return sendResponse({
      messages: payload,
      message: "Message reveived successfully",
    });
  } catch (error) {
    return sendError(error?.statusCode, { message: error.message });
  }
};
