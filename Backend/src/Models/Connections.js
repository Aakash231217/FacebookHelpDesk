const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConnectionSchema = new Schema({
  connectionId: {
    type: String,
    require: true,
  },
  pageId: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("socket_connections", ConnectionSchema);
