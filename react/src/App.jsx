import { Routes, Route } from "react-router-dom"
import "./index.css"
import Home from "./pages/HomePage/HomePage"
import Login from "./pages/LoginPage/LoginPage"
import SignUp from "./pages/SignUpPage/SignUpPage"
import ProtectedRoutes from "./utils/protectedRoutes"
import CreatePage from "./pages/CreatePostPage/CreatePostPage"
import AccountPage from "./pages/AccountPage/AccountPage"

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
