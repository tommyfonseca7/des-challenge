import React from "react";

const GamePage = () => {
  const leaderboardData = [
    { name: "Player 1", netWorth: "$15,000", rank: 1 },
    { name: "Player 2", netWorth: "$12,000", rank: 2 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
  ];

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

      {/* Main content with leaderboard */}
      <div className="flex flex-grow">
        {/* Main content */}
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-3xl font-bold">Table</h1>
        </div>

        {/* Leaderboard */}
        <aside style={{ width: "15%", height: "75vh" }} className="bg-misty-rose p-4 text-black mt-4 mr-4 rounded-2xl border-4 border border-misty-rose overflow-y-auto">
          <h2 className="text-2xl font-semibold text-space-cadet border-b-2 border-space-cadet pb-2 text-center">
            Your position:
          </h2>
          {leaderboardData.map((player) => (
            <div
            key={player.rank}
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

