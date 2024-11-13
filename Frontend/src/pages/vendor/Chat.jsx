import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axiosInstanceVendor from "../../services/axiosInstanceVendor";
import { useSelector } from "react-redux";
import { selectVendor } from "../../features/vendor/vendorSlice";
import { useSocket } from "../../services/socketProvider";
import VendorSidebar from "../../components/VendorSidebar";

function Chat() {
  const location = useLocation();
  const chatId = new URLSearchParams(location.search).get("chatId");
  const userId = new URLSearchParams(location.search).get("userId");
  const { socket } = useSocket();

  const vendor = useSelector(selectVendor);
  const vendorId = vendor.id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch chat history when the chatId changes
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!chatId) return;
      try {
        const response = await axiosInstanceVendor.get(`/chats/${chatId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, [chatId]);

  // Handle receiving messages and typing events
  useEffect(() => {
    if (socket && chatId) {
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
    if (socket && chatId && newMessage) {
      const typingTimeout = setTimeout(() => {
        socket.emit("typing", { roomId: chatId, userId });
      }, 500);

      return () => clearTimeout(typingTimeout);
    }
  }, [newMessage, socket, chatId, userId]);

  // Send a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      if (!socket.connected) {
        console.error("Socket is disconnected. Message not sent.");
        return;
      }

      const messageData = {
        roomId: chatId,
        senderId: vendorId,
        recipientId: userId,
        senderModel: "Vendor",
        recipientModel: "User",
        message: newMessage,
      };

      console.log("Sending message:", messageData);
      setNewMessage("");

      socket.emit("sendMessage", messageData, (ack) => {
        if (ack?.success) {
          console.log("Message successfully sent to server");
          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, timestamp: new Date() },
          ]);
        } else {
          console.error("Message not acknowledged by server");
          setNewMessage(messageData.message);
        }
      });
    } else {
      console.error(
        "Message not sent: either socket is disconnected or input is empty."
      );
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper function to format date with day name
  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const formattedDate = date.toLocaleDateString();
    return `${dayName}, ${formattedDate}`;
  };

  // Helper function to format time in 12-hour format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const messageDate = new Date(msg.timestamp);
    const formattedDate = formatDate(messageDate);

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex">
      <VendorSidebar />

      <div className="flex flex-col h-screen w-full p-4 bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 bg-green-600 text-white font-semibold text-center rounded-t-lg">
          Chat with User {userId}
        </div>

        {/* Message List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {Object.keys(groupedMessages).map((date, index) => (
            <div key={index}>
              {/* Date separator with lines */}
              <div className="flex items-center justify-center text-gray-500 my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="mx-4 text-sm font-medium">{date}</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Messages for the date */}
              {groupedMessages[date].map((msg, msgIndex) => (
                <div
                  key={msgIndex}
                  className={`flex ${
                    msg.senderId === vendorId ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                      msg.senderId === vendorId
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    <p>{msg.message}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        msg.senderId === vendorId
                          ? "text-white opacity-80"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Typing Indicator */}
        {typing && (
          <div className="text-sm text-gray-500 p-2 italic">
            User is typing...
          </div>
        )}

        {/* Message Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center p-4 border-t border-gray-200 bg-white rounded-b-lg"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow p-3 border border-gray-300 rounded-l-full shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="p-3 bg-green-500 text-white rounded-r-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;