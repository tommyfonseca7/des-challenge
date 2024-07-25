// GamePage.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import StockTable from "./components/ui/StockTable"; // Adjust the import path as needed
import Leaderboard from "./components/ui/Leaderboard"; // Adjust the import path as needed

interface UserData {
  name: string;
  netWorth: number;
}

interface Stock {
  symbol: string;
  company: string;
  description: string;
  price: number;
}

const GamePage: React.FC = () => {
  const location = useLocation();
  const userData = location.state?.userData as UserData;

  const [round, setRound] = useState<string>("--");
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(10);
  const [nextGameCountdown, setNextGameCountdown] = useState<number | null>(null);
  const [gameOngoingMessage, setGameOngoingMessage] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [receivedValue, setReceivedValue] = useState<string | null>(null);

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
            setNextGameCountdown(null);
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
              setStockData(data.payload);
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
              setGameEnded(true);
            }
            break;
          case "connected":
            if (!gameStarted && !gameEnded) {
              setGameOngoingMessage(true);
            }
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    }
  }, [lastMessage, gameStarted, gameEnded]);

  const handleValueReceived = (transaction: { symbol: string; quantity: number }) => {
    setReceivedValue(`Bought ${transaction.quantity} of ${transaction.symbol}`);
    console.log(`Transaction received: ${transaction.quantity} units of ${transaction.symbol}`);
    // You can further process the transaction here
  };

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
            <StockTable stocks={stockData} onTransaction={handleValueReceived} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
