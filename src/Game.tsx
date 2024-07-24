function Game() {
    const net_worth = 10000;
    const round = 1;
  return (
    <>
      <div className="mb-10 w-full fixed top-0 left-0 bg-white shadow-md text-green-500 p-5">
        <h1 className="text-xl font-bold text-left">🤑 Stock Master</h1>
      </div>
      <div className="mt-24 w-1/2 text-black p-5">
        <h3 className="text-xl font-bold text-left">Networth: {net_worth}</h3>
        <h3 className="text-xl font-bold text-left">Round: {round}/10</h3>
      </div>
    </>
  )
}

export default Game