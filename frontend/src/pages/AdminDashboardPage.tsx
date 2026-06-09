import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import CommentContext from "../context/commentContext";
import PostContext from "../context/PostContext";
import { Link } from "react-router-dom";

export function AdminDashBoard() {
    const authcontext = useContext(AuthContext);
    const commentcontext = useContext(CommentContext);
    const postcontext = useContext(PostContext);

    if (!authcontext || !postcontext || !commentcontext) {
        return <p>오류가 발생하였습니다 서버관리자한테 연락해보세요</p>
    }
    const {user} = authcontext;
    const { comments } = commentcontext;
    const { posts } = postcontext;

    return (
        <div>
            <div className="title">
                <h1>관리자 대시보드</h1>
                <p>{user?.name}님 반갑습니다</p>
            </div>
            <section>
                <h2>통계</h2>
                <p>전체 댓글 수: {comments.length}</p>
                <p>전체 글 갯수: {posts.length}</p>
            </section>
            <section>
                <h2>글 목록 확인</h2>
                {posts.map((post) => (
                    <div key={post.id}>
                        <p>제목:{post.title}</p>
                        <p>내용:{post.content}</p>
                        <p>상세보기:{""}
                            <Link to={`/posts/${post.id}/detail`}>
                            {post.title}
                            </Link></p>
                    </div>
                ))}
            </section>
            <section>
                <h2>댓글 목록 확인</h2>
                {comments.map((comment) => {
                    const originalPost = posts.find((post) => post.id === comment.postId);
                    return (
                        <div key={comment.id}>
                            <p>
                                원본글: {""}
                                <Link to={`/posts/${comment.postId}/detail`}>
                                    {originalPost
                                    ? originalPost.title
                                    : `삭제된 글 #${comment.postId}`}
                                </Link>
                            </p>
                            <p>댓글 내용:{comment.content}</p>
                        </div>
                    )
                })}
            </section>
        </div>
    )
}
export default AdminDashBoard