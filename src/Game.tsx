import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";


const GamePage = () => {
  const location = useLocation();
  const userData = location.state?.userData;

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://summercamp24.ddns.net:4000",
    {
      onOpen: () => {
        console.log("Connected to WebSocket");
        if (userData) {
          sendMessage(
            JSON.stringify({
              event: "connect-confirm",
              data: userData,
            })
          );
        }
      },
      onClose: (event) => {
        console.log("Disconnected from WebSocket", event);
        if (event.code !== 1000) {
          // 1000 means normal closure
          console.error("Unexpected disconnection");
        }
      },
      onError: (event) => {
        console.error("WebSocket error:", event);
      },
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        console.log("Received message:", data);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div style={{ width: "85%" }} className="flex flex-col">
        {/* Header */}
        <header className="bg-space-cadet shadow-md shadow-slate-gray p-4 flex items-center justify-between text-white">
          <div className="flex items-center ml-2">
            <img
              src="./src/assets/logo-dark-bg.png"
              alt="Logo"
              className="w-20 h-auto"
            />
            <div className="ml-10">
              <span className="text-lg font-bold block">
                Welcome, {userData?.name}
              </span>
              <a href="/" className="text-sky-blue underline block">
                Leave the Game
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center mr-12">
            <span className="text-lg block">
              Available Funds: ${userData?.netWorth}
            </span>
            <span className="text-lg block">
              Net Worth: ${userData?.netWorth}
            </span>
          </div>
          <div className="text-right mr-2">
            <span className="text-2xl font-bold block">Rounds: 3/10</span>
            <span className="text-lg block">Time Remaining: 10:00</span>
          </div>
        </header>

      {/* Main content with leaderboard */}
      <div className="flex flex-grow">
        {/* Main content */}
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-3xl font-bold">Table</h1>
        </div>

        {/* Leaderboard */}
        <aside style={{ width: "13%" }} className="bg-white p-4 text-black mt-4 mr-4 rounded-2xl border-4 border border-[#72ddf7]">
          <h2 className="text-2xl font-semibold text-gray-700 border-b-2 border-gray-400 pb-2 text-center">
            Leaderboard
          </h2>
          {leaderboardData.map((player) => (
            <div
            key={player.rank}
            className="flex items-center bg-gray-200 p-3 my-2 rounded-lg shadow-md border-2 border-gray-400"
            >
              <span className="font-bold text-xl text-gray-700 w-12 text-center">
                #{player.rank}
              </span>
              <div className="flex flex-grow ml-4">
                <div className="flex flex-col">
                  <span className="text-lg text-gray-800">{player.name}</span>
                  <span className="text-sm text-gray-600">{player.netWorth}</span>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Aside for leaderboard */}
      <aside style={{ width: "15%" }} className="bg-slate-gray p-4 text-white">
        <h2 className="text-xl font-bold">Leaderboard</h2>
        <p>Leaderboard content goes here...</p>
      </aside>

      <Chat />
    </div>
  );
};

export default GamePage;
