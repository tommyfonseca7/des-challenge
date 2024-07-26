import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

interface ChatMessageDTO {
  senderId: string;
  receiverId: string;
  message: string;
  datetime: string;
}

interface PlayerDTO {
  id: string;
  name: string;
  netWorth: number;
}

interface ChatProps {
  player: PlayerDTO;
  socket: WebSocket | null;
}

const Chat: React.FC<ChatProps> = ({ player, socket }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>("all");

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case "chat-message":
          setMessages((prevMessages) => [...prevMessages, message.payload]);
          break;
        case "players-list":
          setPlayers(message.payload);
          break;
        case "connected":
          setPlayers((prevPlayers) => [...prevPlayers, message.payload]);
          break;
        case "leave-chat":
          setPlayers((prevPlayers) =>
            prevPlayers.filter((p) => p.id !== message.payload.id)
          );
          break;
        default:
          console.log("Unknown message type received:", message.type);
          break;
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const toggleChat = () => {
    if (!isOpen && socket) {
      socket.send(JSON.stringify({ event: "enter-chat", data: player }));
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !socket) return;

    const chatMessage: ChatMessageDTO = {
      senderId: player.id,
      receiverId: selectedRecipient,
      message: newMessage,
      datetime: new Date().toISOString(),
    };

    socket.send(JSON.stringify({ event: "send-message", data: chatMessage }));
    setNewMessage("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleRecipientChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecipient(e.target.value);
    if (socket) {
      socket.send(JSON.stringify({ event: "enter-chat", data: player }));
    }
  };

  const handleLeaveChat = () => {
    if (socket) {
      socket.send(JSON.stringify({ event: "leave-chat", data: player }));
    }
    setIsOpen(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const getSenderName = (senderId: string) => {
    const player = players.find((p) => p.id === senderId);
    if (player) {
      return player.name;
    } else {
      // Fetch the updated player list if the sender's name is not found
      if (socket) {
        socket.send(JSON.stringify({ event: "enter-chat", data: player }));
      }
      return "Unknown Player"; // Fallback to "Unknown Player" if name is not found
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      <button
        onClick={toggleChat}
        className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="bg-white w-72 h-96 rounded-lg shadow-lg mt-2 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-lg">Live Chat</h2>
            <button
              onClick={handleLeaveChat}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Leave Chat
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-sm">No messages yet...</div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="text-gray-800 mb-2">
                  <strong>
                    {message.senderId === player.id
                      ? "You"
                      : getSenderName(message.senderId)}
                    :
                  </strong>{" "}
                  {message.message} <br />
                  <span className="text-xs text-gray-500">
                    {new Date(message.datetime).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="border-t p-2 flex flex-col">
            <div className="flex items-center mb-2">
              <select
                value={selectedRecipient}
                onChange={handleRecipientChange}
                className="p-2 border rounded-md w-full bg-white"
              >
                <option value="all">All</option>
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded-md bg-white"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md focus:outline-none"
              >
                Send
              </button>
            </div>
            <button
              onClick={handleClearChat}
              className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded mt-2"
            >
              Clear Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
