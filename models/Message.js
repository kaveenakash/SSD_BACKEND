const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: true
    // },
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("messages", MessageSchema);
