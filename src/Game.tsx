import Chat from "./Chat";

const GamePage = () => {
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
              <span className="text-lg font-bold block">Welcome, username</span>
              <a href="/" className="text-sky-blue underline block">
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

        {/* Remaining space */}
        <div className="flex-grow flex items-center justify-center">
          <h1 className="text-3xl font-bold">Table</h1>
        </div>
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
