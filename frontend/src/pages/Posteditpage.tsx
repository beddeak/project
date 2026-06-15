import { Link, useNavigate, useParams } from "react-router-dom";
import PostForm from "../compo/PostForm";
import PostContext from "../context/PostContext";
import { useContext, useEffect, useState } from "react";
type Post = {
    id:number,
    title:string,
    content:string,
    authorId:number,
    authorName:string,
    likedUserIds: number[];
}
function PostEditPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const context = useContext(PostContext);
    if (!context) return <p>글을 찾을수 없습니다</p>;
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const {posts,editPost} = context
    const postId = Number(id);
    useEffect(() => {
        const loadPost = async() => {
            if (Number.isNaN(postId)) {
                setIsLoading(false);
                return;
            }
        const foundPost = posts.find(post => post.id === postId);

        if (foundPost) {
            setPost(foundPost);
            setIsLoading(false);
            return;
        }
        const response = await fetch(`http://localhost:3000/posts/${postId}`);

        if (!response.ok) {
            setPost(null);
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        setPost(data)
        setIsLoading(false);
    };
    loadPost();   
} , [postId,posts]);
    const handleEdit = async (title:string, content:string) => {
        await editPost(postId,title,content);
        navigate(`/posts/${postId}/detail`)
    }

    if (isLoading) {
        return <p>글을 불러오는중입니다</p>
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
