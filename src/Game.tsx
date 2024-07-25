import React from "react";
import StockTable from "./components/ui/StockTable";

const GamePage = () => {
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
            <span className="text-lg font-bold block">Welcome, username</span>
            <a href="#" className="text-blue-500 underline block">
              Leave the Game
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center mr-12">
          <span className="text-lg block">Available Funds: $10,000</span>
          <span className="text-lg block">Net Worth: $15,000</span>
        </div>
        <div className="text-right mr-2">
          <span className="text-2xl font-bold block">Rounds: 3/10</span>
          <span className="text-lg block">Time Remaining: 10:00</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-grow">
        <div className="flex-grow flex flex-col">
          {/* Remaining space */}
          <div className="flex-grow flex items-center justify-center">
            <StockTable />
          </div>
        </div>

        {/* Aside for leaderboard */}
        <aside className="m-3 bg-slate-gray rounded p-4 text-white w-1/4">
          <h2 className="text-xl text-center bg-space-cadet font-bold">Leaderboard</h2>
          <p>Leaderboard content goes here...</p>
        </aside>
      </div>
    </div>
  );
};

export default GamePage;
