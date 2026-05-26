import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signuppage";
import PostlistPage from "./pages/Postlistpage";
import PostDetailPage from "./pages/Postdetailpage";
import PostEditPage from "./pages/Posteditpage";
import MyPostsPage from "./pages/MyPostsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectRoute from "./Route/ProtectRoute";
import PostCreatePage from "./pages/Postcreatepage";
import AdminRoute from "./Route/AdminRoute";
import { PostContextProvider } from "./context/PostContext";
import { AuthContextProvider } from "./context/AuthContext";
import { CommentContextProvider } from "./context/CommentContext";



function App() {
  return (
    <BrowserRouter>
    <AuthContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/" element={<HomePage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/posts" element={<PostlistPage />}/>
        <Route path="/posts/:id/detail" element={<PostDetailPage />}/>
        <Route path="/posts/write" element={<ProtectRoute><PostCreatePage/></ProtectRoute>}/> {/* 나중엔 user정보로 쓰기 */}
        <Route path="/posts/:id/edit" element={<ProtectRoute><PostEditPage /></ProtectRoute>}/>
        <Route path="/mypage/posts" element={<ProtectRoute><MyPostsPage/></ProtectRoute>}/>
        <Route path="/admin" element={<AdminRoute><AdminDashboardPage/></AdminRoute>}/> {/* 나중엔 user정보로 쓰기 */}
      </Routes>
      </CommentContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
