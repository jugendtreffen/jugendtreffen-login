import { useAuth } from "src/auth";
import { navigate, routes } from "@redwoodjs/router";


const SignoutButton = () => {
  const { logOut, loading } = useAuth()
  const onClick = async () => {
    await logOut()
    navigate(routes.home())
  }
  return <button className="primary" onClick={() => onClick()} disabled={loading}>Sign Out</button>
}

export default SignoutButton
