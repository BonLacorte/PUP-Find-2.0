import mongoose, { Schema } from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, trim: true },
    image: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);