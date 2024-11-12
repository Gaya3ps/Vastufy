import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  senderModel: 'User' | 'Vendor';
  recipientModel: 'User' | 'Vendor';
  message: string;
  timestamp: Date;
  read?: boolean; 
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, refPath: 'senderModel', required: true },
    recipientId: { type: Schema.Types.ObjectId, refPath: 'recipientModel', required: true },
    senderModel: { type: String, required: true, enum: ['User', 'Vendor'] },
    recipientModel: { type: String, required: true, enum: ['User', 'Vendor'] },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;
