import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PostContext from "../context/PostContext";
import "./PostListPageStyle.css";

export default function MyPostsPage() {
    const postContext = useContext(PostContext);
    const authContext = useContext(AuthContext);

    if (!postContext || !authContext) {
        return <p>오류가 발생했습니다.</p>;
    }

    const { posts } = postContext;
    const { user } = authContext;

    if (!user) {
        return <p>로그인이 필요합니다.</p>;
    }

    const myPosts = posts.filter((post) => post.authorId === user.id);

    return (
        <div className="post-list-page">
            <div className="post-list-header">
                <Link className="lobby-link" to="/">
                    돌아가기
                </Link>
                <h1>내가 쓴 글</h1>
            </div>
            {myPosts.length === 0 ? (
                <p>작성된 글이 없습니다</p>
            ) : (
                myPosts.map((post) => (
                    <div key={post.id} className="post-item">
                        <div className="post-title">
                            <Link to={`/posts/${post.id}/detail`}>{post.title}</Link>
                        </div>
                        <div className="listpage-username">
                            <p>{post.authorName}</p>
                        </div>
                        <div className="post-content">
                            <p>{post.content}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
