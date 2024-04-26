const connectToDatabase = require("../../Database/db");
const Message = require("../../Models/Message");
const axios = require("axios");
const { sendError, sendResponse } = require("../../Utils/response");

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const db = await connectToDatabase();
  } catch (err) {
    return sendError(err.statusCode, err);
  }
  const body = JSON.parse(event.body);
  const { pageId, clientId, message, accessToken } = body;
  const dataToSend = {
    recipient: { id: clientId },
    messaging_type: "RESPONSE",
    message: { text: message.trim() },
  };

  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${pageId}/messages`,
      dataToSend,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    const errorCode = error?.response?.data?.error?.code;
    if (errorCode === 190) {
      return sendError(400, {
        message:
          "Page access token has expired ... please reconnect to facebook page",
      });
    }
    return sendError(400, error);
  }

  try {
    const newMessage = new Message({
      pageId: pageId,
      senderId: pageId,
      clientId: clientId,
      message: message,
    });
    const savedMessage = await newMessage.save();
  } catch (error) {
    return sendError(400, error);
  }

  return sendResponse({
    message: "Message sent successfully",
  });
};
