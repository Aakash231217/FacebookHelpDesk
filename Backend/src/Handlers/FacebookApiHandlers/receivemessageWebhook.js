const connectToDatabase = require("../../Database/db");
const Connections = require("../../Models/Connections");
const Message = require("../../Models/Message");
const userModel = require("../../Models/User");
const { sendError, sendResponse } = require("../../Utils/response");
const AWS = require("aws-sdk");
const endpoint = process.env.AWS_API_ENDPOINT;

const gatewayClient = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint,
});

const sendToConnection = async (senderId, pageId, message) => {
  try {
    const db = await connectToDatabase();

    const data = await Connections.aggregate([
      { $match: { pageId: pageId } },
      { $sort: { created_at: -1 } },
      { $limit: 1 },
    ]);
    const payload = {
      action: "message",
      senderId,
      pageId,
      message,
      created_at: Date.now(),
    };
    const connection = data[0];
    const connectionId = connection?.connectionId;
    console.log(connection);

    return gatewayClient
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      })
      .promise();
  } catch (err) {
    console.log("ERROR", err);
    return err;
  }
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("WEBHOOK CALLED");

  try {
    const db = await connectToDatabase();
    const body = JSON.parse(event.body);
    if (body?.entry) {
      const entry = body?.entry[0];
      const senderId = entry?.messaging[0]?.sender?.id;
      const pageId = entry?.messaging[0]?.recipient?.id;
      const message = entry?.messaging[0]?.message?.text;

      const newMessage = new Message({
        clientId: senderId,
        senderId: senderId,
        pageId: pageId,
        message: message,
      });

      const savedMessage = await newMessage.save();

      const sentMessage = await sendToConnection(senderId, pageId, message)
        .then((res) => {
          console.log("Message sent");
        })
        .catch((err) => {
          console.log(err);
          console.log("Message sending failed");
        });
    }
    return sendResponse({
      message: "success!",
    });
  } catch (error) {
    return sendError(error?.statusCode, error);
  }
};
