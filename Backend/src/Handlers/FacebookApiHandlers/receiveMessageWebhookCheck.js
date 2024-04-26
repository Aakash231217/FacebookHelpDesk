const connectToDatabase = require("../../Database/db");
const userModel = require("../../Models/User");
const { sendError, sendResponse } = require("../../Utils/response");

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const queryParams = event.queryStringParameters;
    if (queryParams) {
      const verifyToken = process.env.FB_WEBHOOK_VERIFICATION_TOKEN;
      let token = queryParams["hub.verify_token"];
      let challenge = queryParams["hub.challenge"];

      console.log(token);
      console.log(challenge);
      if (token && token === verifyToken) {
        // Respond with the challenge token from the request

        console.log("WEBHOOK_VERIFIED");
        return {
          statusCode: 200,
          body: challenge,
        };
      }
    }

    return sendError(403, { message: "error" });
  } catch (error) {
    return sendError(error?.statusCode, error);
  }
};
