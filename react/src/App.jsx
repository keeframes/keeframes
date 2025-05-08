import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/HomePage/HomePage";
import Login from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProtectedRoutes from "./utils/protectedRoutes";
import CreatePage from "./pages/CreatePostPage/CreatePostPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
