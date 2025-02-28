import { Routes, Route } from "react-router-dom"
import Home from "./pages/HomePage"
import "./index.css"
import Login from "./pages/LoginPage"
import SignUp from "./pages/SignUpPage"
import ProtectedRoutes from "./utils/protectedRoutes"

function App() {
  return (
  <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Home/>}/>
      </Route>
    </Routes>
  )
}

export default App
