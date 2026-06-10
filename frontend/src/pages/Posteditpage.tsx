import { Link, useNavigate, useParams } from "react-router-dom";
import PostForm from "../compo/PostForm";
import PostContext from "../context/PostContext";
import { useContext } from "react";

function PostEditPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const context = useContext(PostContext);
    if (!context) return <p>글을 찾을수 없습니다</p>;
    const {posts,editPost} = context
    const postId = Number(id);
    const post = posts.find(post => post.id === postId);
    const handleEdit = async (title:string, content:string) => {
        await editPost(postId,title,content);
        navigate(`/posts/${postId}/detail`)
    }

    if (!post) {
        return <p>글을 찾을수가 없습니다</p>
    }

    return (
        <div className="Edit-Page">
            <nav className="editor-nav" aria-label="글 수정 페이지 이동">
                <Link className="editor-back-link" to="/posts">
                    글 목록으로 돌아가기
                </Link>
            </nav>
            <PostForm 
                initialTitle={post.title}
                initialContent={post.content}
                onSubmit={handleEdit}
            />
        </div>
    )
}


export default PostEditPage
