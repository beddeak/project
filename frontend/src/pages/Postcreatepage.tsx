import { useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import PostForm from "../compo/PostForm";
import PostContext from "../context/PostContext";
import AuthContext from "../context/AuthContext";

function PostCreatePage() {
    const navigate = useNavigate();
    const context = useContext(PostContext);
    const authcontext = useContext(AuthContext);
    if (!context) {
        return <p>오류가 발생했습니다.</p>;
    }
    const { addPost } = context;
    if (!authcontext) {
        return <p>오류가 발생하였습니다</p>
    }
    const { user } = authcontext;
    if (!user) {
        return <Navigate to="/login" replace />
    }

    const handleWrite = async (title: string, content: string,) => {
        await addPost(title, content,user.id, user.name);
        navigate("/posts")
    };

    return (
        <div className="Create-Page">
            <nav className="editor-nav" aria-label="글쓰기 페이지 이동">
                <Link className="editor-back-link" to="/posts">
                    글 목록으로 돌아가기
                </Link>
            </nav>
            <PostForm onSubmit={handleWrite} />
        </div>
    );
}

export default PostCreatePage;
