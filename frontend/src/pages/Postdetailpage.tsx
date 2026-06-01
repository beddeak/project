import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useState } from "react";
import PostContext from "../context/PostContext";
import CommentContext from "../context/commentContext";
import AuthContext from "../context/AuthContext";
import "./PostDetailPageStyle.css";

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const context = useContext(PostContext);
    const commentcontext = useContext(CommentContext);
    const authcontext = useContext(AuthContext);

    const [commentText, setCommentText] = useState("");
    const [editCommentText, setEditCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

    if (!authcontext) return <p>오류가 발생하였습니다</p>;
    if (!context) return <p>글을 찾을수가없습니다</p>;
    if (!commentcontext) return <p>오류가 발생하였습니다</p>;

    const { user } = authcontext;
    const { posts, deletePost, toggleLike } = context;
    const { comments, addComment, editComment, deleteComment } = commentcontext;

    const postId = Number(id);
    const post = posts.find((post) => post.id === postId);

    if (!post) {
        return <p>글을 찾을수가없습니다</p>;
    }

    const postComment = comments.filter((comment) => comment.postId === postId);

    const isAuthor = user?.id === post.authorId;
    const isAdmin = user?.role === "admin";
    const canManage = isAuthor || isAdmin;
    const likeCount = post.likedUserIds.length;
    const isLiked = user ? post.likedUserIds.includes(user.id) : false;

    const handleDelete = async () => {
        if (!confirm("글을 삭제하시겠습니까?")) return;

        await deletePost(postId);
        navigate("/posts");
    };
    const handleLike = async () => {
        if (!user) {
            return alert("회원가입 혹은 로그인 부탁드립니다")
        }
        await toggleLike(postId,user.id);
    }

    const handleAddComments = () => {
        if (!user) {
            return alert("회원가입 혹은 로그인 부탁드립니다");
        }

        if (!commentText.trim()) {
            return alert("댓글을 입력하세요");
        }

        addComment(postId, commentText.trim(), user.id, user.name);
        setCommentText("");
    };

    const handleStartEditComment = (id: number, content: string) => {
        setEditingCommentId(id);
        setEditCommentText(content);
    };

    const handleEditComment = () => {
        if (editingCommentId === null) return;

        if (!editCommentText.trim()) {
            return alert("댓글을 입력하세요");
        }

        editComment(editingCommentId, editCommentText.trim());
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleDeleteComment = (id: number) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        deleteComment(id);
    };

    return (
        <div className="detail-page">
            <header className="detail-title">
                <h1>{post.title}</h1>
            </header>

            <div className="detail-username">
                <p>{post.authorName}</p>
            </div>

            <div className="detail-body">
                <p>{post.content}</p>
            </div>
            <div className="detail-like">
                <button onClick={handleLike}>
                    {isLiked ? "좋아요" : "좋아요"} {likeCount}</button>
            </div>
            {canManage && (
                <div className="detail-actions">
                    <Link to={`/posts/${post.id}/edit`}>글 수정</Link>
                    <button onClick={handleDelete}>글 삭제하기</button>
                </div>
            )}

            <footer className="detail-comments">
                <h2 className="comment">댓글</h2>

                <div className="input-comment">
                    <h4>댓글 쓰기</h4>
                    <label>입력</label>
                    <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button onClick={handleAddComments}>댓글 작성</button>
                </div>

                {postComment.length === 0 ? (
                    <p>댓글이 없습니다</p>
                ) : (
                    postComment.map((comment) => {
                        const canManageComment =
                            user?.id === comment.authorId || user?.role === "admin";

                        return (
                            <article key={comment.id} className="comment-item">
                                <p className="comment-authorName">
                                    작성자: {comment.authorName}
                                </p>

                                {editingCommentId === comment.id ? (
                                    <div className="comment-edit">
                                        <input
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                        />
                                        <button onClick={handleEditComment}>저장</button>
                                        <button onClick={handleCancelEditComment}>취소</button>
                                    </div>
                                ) : (
                                    <div className="comment-view">
                                        <p>댓글: {comment.content}</p>

                                        {canManageComment && (
                                            <div className="comment-actions">
                                                <button
                                                    onClick={() =>
                                                        handleStartEditComment(
                                                            comment.id,
                                                            comment.content
                                                        )
                                                    }
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteComment(comment.id)
                                                    }
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        );
                    })
                )}
            </footer>
        </div>
    );
}

export default PostDetailPage;
