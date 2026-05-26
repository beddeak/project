import { useParams } from "react-router-dom";
import PostForm from "../compo/PostForm";
import PostContext from "../context/PostContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";


function PostEditPage() {
    const navigate = useNavigate();
    const context = useContext(PostContext);
    if (!context) return <p>글을 찾을수 없습니다</p>;
    const {posts,editPost} = context
    const {id} = useParams();
    const postId = Number(id);
    const post = posts.find(post => post.id === postId);
    const handleEdit = (title:string, content:string) => {
        editPost(postId,title,content);
        navigate(`/posts/${postId}/detail`)
    }

    if (!post) {
        return <p>글을 찾을수가 없습니다</p>
    }

    return (
        <div className="Edit-Page">
            <PostForm 
                initialTitle={post.title}
                initialContent={post.content}
                onSubmit={handleEdit}
            />
        </div>
    )
}


export default PostEditPage