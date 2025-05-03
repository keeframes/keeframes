import { Routes, Route } from "react-router-dom"
import Home from "./pages/HomePage"
import "./index.css"
import Login from "./pages/LoginPage"
import SignUp from "./pages/SignUpPage"
import ProtectedRoutes from "./utils/protectedRoutes"
import CreatePage from "./pages/CreatePostPage"
import AccountPage from "./pages/AccountPage"

function App() {
  return (
  <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/" element={<Home/>}/>
      <Route path="/account" element={<AccountPage />}/>
      <Route element={<ProtectedRoutes/>}>
        <Route path="/create" element={<CreatePage/>}/>
      </Route>
    </Routes>
  )
}

export default App
