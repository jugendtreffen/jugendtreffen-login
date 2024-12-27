import { useAuth } from "src/auth";
import { navigate, routes } from "@redwoodjs/router";


const SignoutButton = () => {
  const { logOut } = useAuth()
  const onClick = async () => {
    await logOut()
    navigate(routes.home())
  }
  return <button className="primary" onClick={() => onClick()}>Sign Out</button>
}

export default SignoutButton
