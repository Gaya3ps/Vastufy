import { useEffect } from "react";
import { useContext } from "react";
import { createContext, useState } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(undefined);

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io("https://vastufy.site");
      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setSocket(newSocket);
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [socket]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
