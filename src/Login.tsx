import { Input } from "./components/ui/input"

function Login() {
  return (
    <>
      <div className="w-full fixed top-0 left-0 bg-white shadow-md text-teal-500 p-4">
        <h1 className="text-xl font-bold">Stock Market Simulator</h1>
      </div>

      <div className="fixed top-20">
        <Input type="username" placeholder="Username"></Input>
      </div>





    </>
  )
}

export default Login
