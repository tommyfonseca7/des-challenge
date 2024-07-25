import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import StockTable from "./components/ui/StockTable";

const GamePage = () => {
  const leaderboardData = [
    { name: "Player 1", netWorth: "$15,000", rank: 1 },
    { name: "Player 2", netWorth: "$12,000", rank: 2 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 4", netWorth: "$9,000", rank: 4 },
    { name: "Player 5", netWorth: "$8,000", rank: 5 },
    { name: "Player 6", netWorth: "$7,000", rank: 6 },
    { name: "Player 7", netWorth: "$6,000", rank: 7 },
    { name: "Player 8", netWorth: "$5,000", rank: 8 },
    { name: "Player 9", netWorth: "$4,000", rank: 9 },
  ];

  const location = useLocation();
  const userData = location.state?.userData;

  const [round, setRound] = useState("--");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [nextGameCountdown, setNextGameCountdown] = useState<number | null>(
    null
  );
  const [gameOngoingMessage, setGameOngoingMessage] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
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
    let timer: NodeJS.Timeout;
    if (gameStarted && round !== "--") {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 10;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimeRemaining(10);
    }
    return () => clearInterval(timer);
  }, [gameStarted, round]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (nextGameCountdown !== null) {
      countdownTimer = setInterval(() => {
        setNextGameCountdown((prevCountdown) => {
          if (prevCountdown && prevCountdown <= 1) {
            clearInterval(countdownTimer);
            setNextGameCountdown(null); // Reset countdown after it reaches 0
          }
          return prevCountdown ? prevCountdown - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(countdownTimer);
  }, [nextGameCountdown]);

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        console.log("Received message:", data);

        switch (data.type) {
          case "round-ended":
            if (gameStarted) {
              setRound(data.payload);
              setTimeRemaining(10);
            } else {
              setGameOngoingMessage(true);
            }
            break;
          case "round-started":
            if (gameStarted && gameEnded) {
              setGameStarted(true);
              setGameOngoingMessage(false);
              setRound("--");
              setTimeRemaining(10);
            } else {
              setGameOngoingMessage(true);
            }
            break;
          case "game-started":
            setGameStarted(true);
            setRound("--");
            setTimeRemaining(10);
            setGameOngoingMessage(false);
            break;
          case "game-ended":
            setGameStarted(false);
            setRound("--");
            setTimeRemaining(10);
            setGameEnded(true);
            break;
          case "message":
            if (data.payload.includes("Next game will start in")) {
              const countdownSeconds = 20;
              setNextGameCountdown(countdownSeconds);
              setGameEnded(true); // Set this to true to hide ongoing message
            }
            break;
          case "connected":
            if (!gameStarted && !gameEnded) {
              setGameOngoingMessage(true);
            }
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage, gameStarted, gameEnded]);

  return (
    <div className="flex flex-col h-screen">
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
          <span className="text-2xl font-bold block">Rounds: {round}</span>
          {gameStarted && (
            <span className="text-lg block">
              Time Remaining: {timeRemaining}s
            </span>
          )}
        </div>
      </header>

      {/* Main content with leaderboard */}
      <div className="flex flex-grow">
        {/* Main content */}
        <div className="flex-grow flex items-center justify-center">
          {nextGameCountdown !== null ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                A game is about to start in: {nextGameCountdown}s
              </h1>
              <div className="mt-4 mx-auto w-16 h-16 border-4 border-t-4 border-t-sky-blue border-space-cadet rounded-full animate-spin" />
            </div>
          ) : gameOngoingMessage ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                A game is already ongoing, please wait until the next one
                starts.
              </h1>
            </div>
          ) : (
            <StockTable />
          )}
        </div>

        {/* Leaderboard */}
        <aside
          style={{ width: "15%", height: "75vh" }}
          className="bg-misty-rose p-4 text-black mt-4 mr-4 rounded-2xl border-4 border border-misty-rose overflow-y-auto"
        >
          <h2 className="text-2xl font-semibold text-space-cadet border-b-2 border-space-cadet pb-2 text-center">
            Your position:
          </h2>
          {leaderboardData.map((player, index) => (
            <div
              key={`${player.rank}-${index}`}
              className="flex items-center bg-white p-3 my-2 rounded-lg shadow-md border-2 border-white"
            >
              <span className="font-bold text-xl text-space-cadet w-12 text-center">
                #{player.rank}
              </span>
              <div className="flex flex-grow ml-4">
                <div className="flex flex-col">
                  <span className="text-lg text-black">{player.name}</span>
                  <span className="text-sm text-black">{player.netWorth}</span>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default GamePage;
