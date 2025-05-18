// ✅ App.tsx는 아래처럼 깔끔하게 유지하세요

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import MainPage from "./pages/MainPage";
import CreateCourse from "./pages/CreateCourse";
import Post from "./pages/Post";
import Course from "./pages/Course";
import Like from "./pages/Like";
import CreatePost from "./pages/CreatePost";
import EditInfo from "./component/pages/EditInfo";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/WelcomePage" element={<WelcomePage />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/CreateCourse" element={<CreateCourse />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/Post" element={<Post />} />
        <Route path="/Course" element={<Course />} />
        <Route path="/Like" element={<Like />} />
        <Route path="/EditInfo" element={<EditInfo />} />
      </Routes>
    </Router>
  );
}
