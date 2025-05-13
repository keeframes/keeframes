import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import SignUp from "./pages/SignUpPage/SignUpPage";
import ProtectedRoutes from "./utils/protectedRoutes";
import Create from "./pages/CreatePostPage/CreatePostPage";
import Chat from "./pages/ChatPage/ChatPage";
import Profile from "./pages/ProfilePage/ProfilePage";
import EditProfile from "./pages/EditProfilePage/EditProfilePage";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
