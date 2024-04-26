const { sendError, sendResponse } = require("../../Utils/response");
const connectToDatabase = require("../../Database/db");
const Connections = require("../../Models/Connections");
const AWS = require("aws-sdk");
const endpoint = process.env.AWS_API_ENDPOINT;

const gatewayClient = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint,
});

const sendConfirmation = async (connectionId, payload) => {
  console.log(connectionId);
  console.log(payload);
  return gatewayClient
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(payload),
    })
    .promise();
};

const joinChat = async (pageId, connectionId) => {
  console.log("JOINING", connectionId);

  try {
    const db = await connectToDatabase();

    // Delete previous socket connection with this pageId
    await Connections.deleteMany({ pageId: pageId });

    // Creating new connection
    const newConnection = new Connections({
      pageId: pageId,
      connectionId: connectionId,
    });
    console.log(newConnection);
    const savedConnection = await newConnection.save();
    console.log("New connection saved");
    const payload = {
      action: "socket-init-confirmation",
      status: 200,
      message: "Socket initialised",
    };
    await sendConfirmation(connectionId, payload);
  } catch (err) {
    const payload = {
      action: "socket-init-confirmation",
      status: 400,
      message:
        "Could not initialise socket channel ... please refresh the page",
    };
    await sendConfirmation(connectionId, payload);
    return sendError(400, err);
  }
};

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { connectionId, eventType } = event.requestContext;

  if (eventType === "CONNECT") {
    console.log(`New connection : ${connectionId}`);
  } else {
    if (event.body && event.body !== "") {
      const payload = JSON.parse(event.body);
      if (payload) {
        switch (payload.action) {
          case "join-chat":
            await joinChat(payload?.pageId, connectionId);
            break;

          default:
            break;
        }
      }
    }
  }
  return sendResponse({ message: "Hello from lambda function" });
};
