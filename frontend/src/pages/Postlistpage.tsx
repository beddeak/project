import { Link } from "react-router-dom";
import PostContext from "../context/PostContext";
import "./PostListPageStyle.css";
import { useContext } from "react";

function PostListPage() {
    const context = useContext(PostContext);
    if (!context) return <p>해당 글을 찾을수가없습니다</p>;
    const { posts } = context;

    return (
        <div className="post-list-page">
            {posts.length === 0 ? (
                <p>작성된 글이 없습니다</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-item">
                        <div className="post-title">
                            <Link to={`/posts/${post.id}/detail`}>{post.title}</Link>
                        </div>
                        <div className="listpage-username"><p>{post.authorName}</p></div>
                        <div className="post-content">
                            <p>{post.content}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default PostListPage;
