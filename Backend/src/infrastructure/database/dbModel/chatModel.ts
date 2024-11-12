
import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  users: mongoose.Types.ObjectId[];
  latestMessage: mongoose.Types.ObjectId;
  unreadCount: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      {
        type: Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    unreadCount: { type: Map, of: Number, default: {} },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model<IChat>('Chat', ChatSchema);

export default ChatModel;
