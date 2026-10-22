import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BoardPage from "./pages/BoardPage";
import PostWritePage from "./pages/PostWritePage";
import PostDetailPage from "./pages/PostDetailPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

// TODO: 로그인 상태 관리(Context 등)를 도입해서 로그아웃 기능을 구현하세요.
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/board/write" element={<PostWritePage />} />
          <Route path="/board/:postId" element={<PostDetailPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
