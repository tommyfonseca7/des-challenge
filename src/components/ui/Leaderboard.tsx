import React, { useState } from "react";
import "./scrollbar.css"

function Leaderboard({ leaderboardData }) {

  const sortedData = leaderboardData.slice().sort((a, b) => b.netWorth - a.netWorth);

  const rankedData = sortedData.map((player: any, index: number) => ({...player, rank: index + 1,}));

  return (
      <div style={{ width: "35vw", height: "36vh" }} className="bg-misty-rose p-4 text-black mt-10 rounded-2xl border-8 border-misty-rose overflow-y-auto custom-scrollbar">
        <h2 className="text-2xl font-semibold text-space-cadet border-b-2 border-space-cadet pb-2 text-center">
          Leaderboard
        </h2>
        {rankedData.map((player) => (
          <div
            key={player.rank}
            className="flex items-center bg-white p-3 my-2 rounded-lg shadow-md border-2 border-white"
          >
            <span className="font-bold text-xl text-space-cadet w-12 text-center">
              #{player.rank}
            </span>
            <div className="flex flex-grow ml-4 justify-between">
              <span className="text-lg text-black">{player.name}</span>
              <span className="text-lg text-black">{player.netWorth.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>     
  )
}


export default Leaderboard;