import mongoose, { Schema } from "mongoose";

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastSeenMessage: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        message: { type: Schema.Types.ObjectId, ref: "Message" },
        text: { type: String },
        image: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);