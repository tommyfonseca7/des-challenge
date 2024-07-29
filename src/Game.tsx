import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import StockTable from "./components/ui/StockTable";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Chat from "./Chat";
import Leaderboard from "./components/ui/Leaderboard";

const GamePage = () => {
  const location = useLocation();
  const userData = location.state?.userData;

  const [round, setRound] = useState("--");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [nextGameCountdown, setNextGameCountdown] = useState<number | null>(
    null
  );
  const [gameOngoingMessage, setGameOngoingMessage] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [savedWallet, setWallet] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const { sendMessage, lastMessage, getWebSocket } = useWebSocket(
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
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && round !== "--") {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimeRemaining(30);
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
              setTimeRemaining(30);
            } else {
              setGameOngoingMessage(true);
            }
            break;
          case "round-started":
            if (gameStarted && gameEnded) {
              setGameStarted(true);
              setGameOngoingMessage(false);
              setTimeRemaining(30);
              fetchWallet();
              setStockData(data.payload);
            } else {
              setGameOngoingMessage(true);
            }
            break;
          case "game-started":
            setGameStarted(true);
            setRound("--");
            setTimeRemaining(30);
            setGameOngoingMessage(false);
            break;
          case "game-ended":
            setGameStarted(false);
            setRound("--");
            setTimeRemaining(30);
            setGameEnded(true);
            setLeaderboardData(data.payload);
            break;
          case "message":
            if (data.payload.includes("Next game will start in")) {
              const countdownSeconds = 60;
              setNextGameCountdown(countdownSeconds);
              setGameEnded(true);
            }
            break;
          case "connected":
            if (!gameStarted && !gameEnded) {
              setGameOngoingMessage(true);
            }
            break;
          case "Transaction":
            fetchWallet();
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage, gameStarted, gameEnded]);

  async function fetchWallet() {
    try {
      const response = await fetch(
        `http://summercamp24.ddns.net:4000/game/player/${userData.id}/wallet`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      const { wallet } = responseData;
      if (wallet) {
        setWallet(wallet);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch wallet",
      });
      console.error("Failed to fetch wallet:", error);
    }
  }

  const webSocketInstance = getWebSocket();

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-space-cadet shadow-md shadow-slate-gray p-4 flex items-center justify-between text-white fixed w-full z-10">
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

      <div className="flex flex-grow pt-24">
        <div className="flex-grow flex items-center justify-center">
          {nextGameCountdown !== null ? (
            <div className="text-center flex flex-col items-center min-h-screen py-4">
              <div className="mt-10 mb-20 w-full">
                <h1 className="text-3xl font-bold mb-2">
                  Last game's results:
                </h1>
                <Leaderboard leaderboardData={leaderboardData} />
              </div>
              <div className="mb-20 w-full">
                <h1 className="text-3xl font-bold mb-4">
                  A new game will start in: {nextGameCountdown}s
                </h1>
                <div className="mx-auto w-16 h-16 border-4 border-t-4 border-t-sky-blue border-space-cadet rounded-full animate-spin" />
              </div>
            </div>
          ) : gameOngoingMessage ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                A game is already ongoing, please wait until the next one
                starts.
              </h1>
            </div>
          ) : (
            <StockTable stocks={stockData} wallet={savedWallet} />
          )}
        </div>
      </div>
      {webSocketInstance instanceof WebSocket && (
        <Chat player={userData} socket={webSocketInstance as WebSocket} />
      )}
      <Toaster />
    </div>
  );
};

export default GamePage;
