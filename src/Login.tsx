import { ProfileForm } from "./LoginForm"
function Login() {
  return (
    <>
      <div className="w-full fixed top-0 left-0 bg-white shadow-md text-green-500 p-5">
        <h1 className="text-xl font-bold text-left">🤑 Stock Master</h1>
      </div>
      <div className="flex justify-center mt-10">
        <ProfileForm />
      </div>
    </>
  )
}

export default Login
