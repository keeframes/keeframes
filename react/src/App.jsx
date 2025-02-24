import { Routes, Route } from "react-router-dom"
import Home from "./pages/HomePage"
import "./index.css"
import Login from "./pages/LoginPage"
import ProtectedRoutes from "./utils/protectedRoutes"

function App() {
  return (
  <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/" element={<Home/>}/>
      </Route>
    </Routes>
  )
}

export default App
