import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstanceUser from "../../services/axiosInstanceUser";
import MessageArea from "../../components/MessageArea";
import Header from "../../components/Header";
import ProfileSidebar from "../../components/ProfileSidebar";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useSocket } from "../../services/socketProvider";

const useQuery = () => new URLSearchParams(useLocation().search);

function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [typing, setTyping] = useState(false);
  const { socket } = useSocket();
  const user = useSelector(selectUser);
  const query = useQuery();
  const vendorId = query.get("vendorId");
  const userId = user.id;
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  console.log(socket,"jjjjjlllllllllllll");
  

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axiosInstanceUser.get(`/chat/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    if (chatId) fetchChatHistory();
  }, [chatId]);

  // Handle receiving messages
  useEffect(() => {
    if (socket) {
      socket.emit("join_room", chatId);

      socket.on("receiveMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      socket.on("typing", (data) => {
        if (data.roomId === chatId) {
          setTyping(true);
          setTimeout(() => setTyping(false), 2000);
        }
      });

      return () => {
        socket.emit("leave_room", chatId);
        socket.off("receiveMessage");
        socket.off("typing");
      };
    }
  }, [socket, chatId]);

  // Handle typing event
  useEffect(() => {
    if (socket && chatId && messageInput) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: chatId, userId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [messageInput, socket, chatId, userId]);

  const handleSendMessage = (messageContent) => {
    if (messageContent.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }
  
      const messageData = {
        roomId: chatId,
        senderId: userId,
        recipientId: vendorId,
        senderModel: "User",
        recipientModel: "Vendor",
        message: messageContent, // Use messageContent from MessageArea
      };
  
      console.log("Sending message:", messageData);
  
      // Emit the message to the server
      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          console.log("Message successfully sent to server");
          // Optimistically update the UI
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
        }
      });
    } else {
      console.error("Message not sent: either socket is disconnected or input is empty.");
    }
  };
  

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex h-screen">
      <div className="w-64 fixed top-0 left-0 h-full z-10">
        <ProfileSidebar className="h-full bg-gradient-to-b from-gray-800 to-gray-600 text-white shadow-lg" />
      </div>

      <div className="flex flex-col flex-grow ml-64 h-full">
        <div className="flex-none">
          <Header
            title="Vastufy"
            className="bg-blue-600 text-white p-4 shadow-md"
          />
        </div>

        <div className="flex-grow p-6 overflow-y-auto mt-20">
          <div className="h-full bg-white rounded-lg shadow-lg flex flex-col justify-between">
            <MessageArea
              messages={messages}
              onSendMessage={handleSendMessage}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              typing={typing}
              recipientName={`Vendor ${vendorId}`}
              className="flex-grow overflow-y-auto"
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
