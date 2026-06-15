import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import PostContext from "../context/PostContext";
import CommentContext from "../context/commentContext";
import AuthContext from "../context/AuthContext";
import "./PostDetailPageStyle.css";
type Post = {
    id:number,
    title:string,
    content:string,
    authorId:number,
    authorName:string,
    likedUserIds: number[];
}

function PostDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const context = useContext(PostContext);
    const commentcontext = useContext(CommentContext);
    const authcontext = useContext(AuthContext);

    const [commentText, setCommentText] = useState("");
    const [editCommentText, setEditCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [isPostReportOpen, setIsPostReportOpen] = useState(false);
    const [postReportReason, setPostReportReason] = useState("");
    const [reportingCommentId, setReportingCommentId] = useState<number | null>(null);
    const [commentReportReason, setCommentReportReason] = useState("");
    const [post,setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const posts = context?.posts;
    const postId = Number(id);
    useEffect(() => {
        const loadPost = async() => {
            if (!posts) {
                setIsLoading(false);
                return;
            }   
            if (Number.isNaN(postId)) {
                setIsLoading(false);
                return;
            }
            const foundPost = posts.find(post => post.id === postId)
            if (foundPost) {
                setPost(foundPost)
                setIsLoading(false)
                return;
            }
            const response = await fetch(`http://localhost:3000/posts/${postId}`)
            if (!response.ok) {
                setPost(null)
                setIsLoading(false)
                return;

            }
            const data = await response.json()
            setPost(data)
            setIsLoading(false)
        }
        loadPost();
    }, [postId, posts])

    if (!authcontext) return <p>오류가 발생하였습니다</p>;
    if (!context) return <p>글을 찾을수가없습니다</p>;
    if (!commentcontext) return <p>오류가 발생하였습니다</p>;

    const { user } = authcontext;
    const { deletePost, toggleLike } = context;
    const { comments, addComment, editComment, deleteComment } = commentcontext;

    if (isLoading) {
        return <p>글을 불러오는 중입니다</p>;
    }

    if (!post) {
        return <p>글을 찾을수가없습니다</p>;
    }

    const postComment = comments.filter((comment) => comment.postId === postId);

    const isAuthor = user?.id === post.authorId;
    const isAdmin = user?.role === "admin";
    const canManage = isAuthor || isAdmin;
    const likeCount = post.likedUserIds.length;
    const isLiked = user ? post.likedUserIds.includes(user.id) : false;
    const handleReportPost = async () => {
        if (!user) {
            alert("로그인 부탁드립니다")
            return;
        }
        const reason = postReportReason.trim();

        if (!reason) {
            alert("신고 사유를 입력해주세요");
            return;
        }
        const respone = await fetch("http://localhost:3000/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reporterId:user.id,
                reporterName:user.name,
                content: post.content,
                targetType:"post",
                targetId: post.id,
                postId: post.id,
                targetTitle: post.title,
                reason: reason.trim(),
            }),
        })
        if (!respone.ok) {
            alert("신고에 실패했습니다")
            return;
        }
        alert("신고가 접수되었습니다")
        setPostReportReason("");
        setIsPostReportOpen(false);
    }
    const handleReportComment = async(commentId: number, content: string) => {
        if (!user) {
            alert("로그인하세요")
            return;
        }
        const reason = commentReportReason.trim();

        if (!reason) {
            alert("신고 사유를 입력해주세요");
            return;
        }
        const respone = await fetch("http://localhost:3000/reports", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            reporterId:user.id,
            reporterName:user.name,
            content,
            targetType:"comment",
            targetId: commentId,
            postId: post.id,
            targetTitle: post.title,
            reason: reason.trim(),
        })
    })
    if (!respone.ok) {
        alert("신고에 실패했습니다")
        return;
    }
    alert("신고가 접수되었습니다")
    setCommentReportReason("");
    setReportingCommentId(null);
}
    const handleDelete = async () => {
        if (!confirm("글을 삭제하시겠습니까?")) return;

        await deletePost(postId);
        navigate("/posts");
    };
    const handleLike = async () => {
        if (!user) {
            return alert("회원가입 혹은 로그인 부탁드립니다")
        }
        const updatedPost = await toggleLike(postId, user.id);

        if (updatedPost) {
            setPost(updatedPost);
        }
    }

    const handleAddComments = async () => {
        if (!user) {
            return alert("회원가입 혹은 로그인 부탁드립니다");
        }

        if (!commentText.trim()) {
            return alert("댓글을 입력하세요");
        }

        await addComment(postId, commentText.trim(), user.id, user.name);
        setCommentText("");
    };

    const handleStartEditComment = (id: number, content: string) => {
        setEditingCommentId(id);
        setEditCommentText(content);
    };

    const handleEditComment = async () => {
        if (editingCommentId === null) return;

        if (!editCommentText.trim()) {
            return alert("댓글을 입력하세요");
        }

        await editComment(editingCommentId, editCommentText.trim());
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    const handleDeleteComment = async (id: number) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        await deleteComment(id);
    };

    return (
        <div className="detail-page">
            <header className="detail-title">
                <Link className="detail-exit-link" to="/posts">
                    나가기
                </Link>
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
                    {isLiked ? "❤️좋아요" : "♡좋아요"} {likeCount}</button>
            </div>
            <div className="report-button">
                <button
                    className="post-report-button"
                    onClick={() => setIsPostReportOpen((isOpen) => !isOpen)}
                >
                    게시글 신고
                </button>
                {isPostReportOpen && (
                    <div className="report-form">
                        <label htmlFor="post-report-reason">게시글 신고 사유</label>
                        <textarea
                            id="post-report-reason"
                            value={postReportReason}
                            onChange={(e) => setPostReportReason(e.target.value)}
                            placeholder="신고 사유를 입력해주세요."
                        />
                        <div className="report-form__actions">
                            <button onClick={handleReportPost}>신고 접수</button>
                            <button
                                onClick={() => {
                                    setIsPostReportOpen(false);
                                    setPostReportReason("");
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                )}
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

                                        <div className="comment-actions">
                                            <button
                                                className="comment-report-button"
                                                onClick={() => {
                                                    setReportingCommentId(
                                                        reportingCommentId === comment.id
                                                            ? null
                                                            : comment.id
                                                    );
                                                    setCommentReportReason("");
                                                }}
                                            >
                                                댓글 신고
                                            </button>
                                            {canManageComment && (
                                                <>
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
                                                </>
                                            )}
                                        </div>
                                        {reportingCommentId === comment.id && (
                                            <div className="report-form comment-report-form">
                                                <label htmlFor={`comment-report-reason-${comment.id}`}>
                                                    댓글 신고 사유
                                                </label>
                                                <textarea
                                                    id={`comment-report-reason-${comment.id}`}
                                                    value={commentReportReason}
                                                    onChange={(e) =>
                                                        setCommentReportReason(e.target.value)
                                                    }
                                                    placeholder="신고 사유를 입력해주세요."
                                                />
                                                <div className="report-form__actions">
                                                    <button
                                                        onClick={() =>
                                                            handleReportComment(
                                                                comment.id,
                                                                comment.content
                                                            )
                                                        }
                                                    >
                                                        신고 접수
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReportingCommentId(null);
                                                            setCommentReportReason("");
                                                        }}
                                                    >
                                                        취소
                                                    </button>
                                                </div>
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
