import React, { useState } from "react";

function Leaderboard() {

const leaderboardData = [
    { name: "Player 1", netWorth: "$15,000", rank: 1 },
    { name: "Player 2", netWorth: "$12,000", rank: 2 },
    { name: "Player 3", netWorth: "$10,000", rank: 3 },
    { name: "Player 3", netWorth: "$10,000", rank: 4 },
    { name: "Player 3", netWorth: "$10,000", rank: 5 },
    { name: "Player 3", netWorth: "$10,000", rank: 6 },
    { name: "Player 3", netWorth: "$10,000", rank: 7 },
    { name: "Player 3", netWorth: "$10,000", rank: 8 },
    { name: "Player 3", netWorth: "$10,000", rank: 9 },
  ];

  return (
    <>
    <aside style={{ width: "15vw", height: "76vh" }} className="bg-misty-rose p-4 text-black mt-4 mr-4 rounded-2xl border-4 border border-misty-rose overflow-y-auto mb-4">
            <h2 className="text-1xl font-semibold text-space-cadet border-b-2 border-space-cadet pb-2 text-center">
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
    </>

        
  )
}


export default Leaderboard;