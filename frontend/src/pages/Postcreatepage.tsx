import { useContext } from "react";
import { useNavigate,Navigate } from "react-router-dom";
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

    const handleWrite = (title: string, content: string,) => {
        addPost(title, content,user.id,user.name);
        navigate("/posts");
    };

    return (
        <div className="Create-Page">
            <PostForm onSubmit={handleWrite} />
        </div>
    );
}

export default PostCreatePage;
