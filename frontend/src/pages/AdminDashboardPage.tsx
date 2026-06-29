import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CommentContext from "../context/commentContext";
import PostContext from "../context/PostContext";
import "./AdminDashboardPage.css";

function AdminMark() {
    return (
        <div className="admin-security-mark" aria-hidden="true">
            <span className="admin-security-mark__ring" />
            <span className="admin-security-mark__core">AD</span>
            <span className="admin-security-mark__line admin-security-mark__line--one" />
            <span className="admin-security-mark__line admin-security-mark__line--two" />
            <span className="admin-security-mark__line admin-security-mark__line--three" />
        </div>
    );
}

function StatusIcon({ type }: { type: "post" | "comment" | "member" | "review" }) {
    const paths = {
        post: (
            <>
                <path d="M4 7.5h16v12H4z" />
                <path d="M3 4.5h18v3H3zM9 11.5h6" />
            </>
        ),
        comment: (
            <>
                <path d="M4 18v2M8 14v6M12 10v10M16 6v14M20 3v17" />
            </>
        ),
        member: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
            </>
        ),
        review: (
            <>
                <path d="M12 3 5 6v5c0 4.7 2.6 8.1 7 10 4.4-1.9 7-5.3 7-10V6l-7-3Z" />
                <path d="m9 12 2 2 4-5" />
            </>
        ),
    };

    return (
        <svg className="admin-status-icon" viewBox="0 0 24 24" aria-hidden="true">
            {paths[type]}
        </svg>
    );
}
type Report = {
    id:number;
    reporterName:string;
    content:string;
    targetType: "post" | "comment";
    targetId:number;
    targetTitle:string | null;
    reason: string;
    status: "pending" | "resolved" | "rejected";
    postId:number | null
};
export function AdminDashBoard() {
    const [reports,setReports] = useState<Report[]>([]);
    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("http://localhost:3000/reports", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                alert("신고 목록을 불러오지 못했습니다.");
                return;
            }

            const data: Report[] = await response.json();
            setReports(data);
        };

        fetchReports();
    }, []);
    const authcontext = useContext(AuthContext);
    const commentcontext = useContext(CommentContext);
    const postcontext = useContext(PostContext);

    if (!authcontext || !postcontext || !commentcontext) {
        return <p>관리자 데이터를 불러올 수 없습니다.</p>;
    }

    const { user, logout } = authcontext;
    const { comments, deleteComment } = commentcontext;
    const { posts, deletePost } = postcontext;
    const activeAuthors = new Set(posts.map((post) => post.authorId)).size;
    const handlePostDelete = async (postId:number) => {
        if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }
        await deletePost(postId);
    }
    const handleCommentDelete = async (commentId:number) => {
        if (!window.confirm("정말로 이 댓글을 삭제하시겠습니가?")) {
            return;
        }

        await deleteComment(commentId);
    }
    const handleReportResolve = async (reportId:number) => {
        const token = localStorage.getItem("accessToken")
        const response = await fetch(`http://localhost:3000/reports/${reportId}/resolve`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert("신고 처리에 실패했습니다.");
            return;
        }

        const resolvedReport: Report = await response.json();
        setReports((currentReports) =>
            currentReports.map((report) =>
                report.id === reportId ? resolvedReport : report
            )
        );
    }
    const handleReportDelete = async (reportId:number) => {
        if (!window.confirm("이 신고 기록을 삭제하시겠습니까?")) {
            return;
        }
        const token = localStorage.getItem("accessToken")
        const response = await fetch(`http://localhost:3000/reports/${reportId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            alert("신고 삭제에 실패했습니다.");
            return;
        }

        setReports((currentReports) =>
            currentReports.filter((report) => report.id !== reportId)
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__noise" aria-hidden="true" />

            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <AdminMark />
                    <div>
                        <span className="admin-eyebrow">COMMUNITY MANAGEMENT</span>
                        <strong>ADMIN CENTER</strong>
                        <small>MANAGEMENT DASHBOARD</small>
                    </div>
                </div>

                <div className="admin-clearance">
                    <span>ADMIN ROLE</span>
                    <strong>SUPER ADMIN</strong>
                    <small>ALL MANAGEMENT PERMISSIONS</small>
                </div>

                <nav className="admin-nav" aria-label="관리자 메뉴">
                    <a className="admin-nav__item admin-nav__item--active" href="#overview">
                        <span>01</span>
                        대시보드
                    </a>
                    <a className="admin-nav__item" href="#post-archive">
                        <span>02</span>
                        게시글 관리
                    </a>
                    <a className="admin-nav__item" href="#comment-feed">
                        <span>03</span>
                        댓글 관리
                    </a>
                    <a className="admin-nav__item" href="#report-management">
                        <span>04</span>
                        신고 관리
                    </a>
                    <Link className="admin-nav__item" to="/posts">
                        <span>05</span>
                        커뮤니티로 이동
                    </Link>
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-system-status">
                        <span className="admin-live-dot" />
                        <div>
                            <strong>COMMUNITY SERVICE</strong>
                            <small>서비스 정상 운영 중</small>
                        </div>
                    </div>
                    <button type="button" className="admin-logout" onClick={logout}>
                        로그아웃
                        <span>↗</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar__location">
                        <span>ADMIN DASHBOARD</span>
                        <strong>COMMUNITY / OVERVIEW</strong>
                    </div>
                    <div className="admin-topbar__right">
                        <div className="admin-classified">
                            <span>MANAGEMENT STATUS</span>
                            <strong>NORMAL</strong>
                        </div>
                        <div className="admin-operator">
                            <span>AD</span>
                            <div>
                                <small>CURRENT ADMIN</small>
                                <strong>{user?.name ?? "UNKNOWN"}</strong>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <section className="admin-hero" id="overview">
                        <div>
                            <span className="admin-section-code">DASH.01 / OVERVIEW</span>
                            <h1>
                                커뮤니티 관리자
                                <small>COMMUNITY MANAGEMENT</small>
                            </h1>
                            <p>
                                게시글과 댓글, 활동 현황을 한눈에 확인하고 커뮤니티 운영에
                                필요한 항목을 관리할 수 있습니다.
                            </p>
                        </div>
                        <div className="admin-alert-level">
                            <div className="admin-alert-level__dial">
                                <span>OK</span>
                            </div>
                            <div>
                                <small>COMMUNITY STATUS</small>
                                <strong>정상 운영 중</strong>
                                <span>CONTENT UP TO DATE</span>
                            </div>
                        </div>
                    </section>

                    <section className="admin-stats" aria-label="관리 현황 통계">
                        <article className="admin-stat-card">
                            <StatusIcon type="post" />
                            <div>
                                <span>TOTAL POSTS</span>
                                <strong>{String(posts.length).padStart(2, "0")}</strong>
                                <small>전체 게시글</small>
                            </div>
                            <em>POSTS</em>
                        </article>
                        <article className="admin-stat-card">
                            <StatusIcon type="comment" />
                            <div>
                                <span>TOTAL COMMENTS</span>
                                <strong>{String(comments.length).padStart(2, "0")}</strong>
                                <small>전체 댓글</small>
                            </div>
                            <em>COMMENTS</em>
                        </article>
                        <article className="admin-stat-card">
                            <StatusIcon type="member" />
                            <div>
                                <span>ACTIVE AUTHORS</span>
                                <strong>{String(activeAuthors).padStart(2, "0")}</strong>
                                <small>게시글 작성자</small>
                            </div>
                            <em>CONTRIBUTORS</em>
                        </article>
                        <article className="admin-stat-card admin-stat-card--warning">
                            <StatusIcon type="review" />
                            <div>
                                <span>REPORTED CONTENT</span>
                                <strong>{String(reports.length).padStart(2, "0")}</strong>
                                <small>접수된 신고</small>
                            </div>
                            <em>REVIEW REQUIRED</em>
                        </article>
                    </section>

                    <section className="admin-grid">
                        <article className="admin-panel admin-panel--records" id="post-archive">
                            <div className="admin-panel__header">
                                <div>
                                    <span className="admin-section-code">POST.02 / MANAGEMENT</span>
                                    <h2>게시글 관리</h2>
                                </div>
                                <span className="admin-panel__count">{posts.length} POSTS</span>
                            </div>

                            <div className="admin-record-table">
                                <div className="admin-record-table__head">
                                    <span>POST ID</span>
                                    <span>제목 / 작성자</span>
                                    <span>좋아요</span>
                                    <span>관리</span>
                                </div>
                                {posts.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <strong>NO POSTS YET</strong>
                                        <span>등록된 게시글이 없습니다.</span>
                                    </div>
                                ) : (
                                    posts.slice(0, 6).map((post) => (
                                        <div className="admin-record-row" key={post.id}>
                                            <span className="admin-record-id">
                                                POST-{String(post.id).padStart(3, "0")}
                                            </span>
                                            <div className="admin-record-title">
                                                <strong>{post.title}</strong>
                                                <span>작성자: {post.authorName || "알 수 없음"}</span>
                                            </div>
                                            <span className="admin-record-likes">
                                                {post.likedUserIds.length}개
                                            </span>
                                            <Link
                                                className="admin-inspect-link"
                                                to={`/posts/${post.id}/detail`}
                                            >
                                                상세
                                                <span>↗</span>
                                            </Link>
                                            <button
                                                type="button"
                                                className="admin-danger-button"
                                                onClick={() => handlePostDelete(post.id)}
                                            >
                                            삭제버튼
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </article>

                        <article className="admin-panel admin-panel--feed" id="comment-feed">
                            <div className="admin-panel__header">
                                <div>
                                    <span className="admin-section-code">COMMENT.03 / MANAGEMENT</span>
                                    <h2>최근 댓글</h2>
                                </div>
                                <span className="admin-live-label">
                                    <span className="admin-live-dot" />
                                    LATEST
                                </span>
                            </div>

                            <div className="admin-comment-feed">
                                {comments.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <strong>NO COMMENTS YET</strong>
                                        <span>등록된 댓글이 없습니다.</span>
                                    </div>
                                ) : (
                                    comments.slice(-5).reverse().map((comment, index) => {
                                        const originalPost = posts.find(
                                            (post) => post.id === comment.postId,
                                        );

                                        return (
                                            <Link
                                                className="admin-comment"
                                                key={comment.id}
                                                to={`/posts/${comment.postId}/detail`}
                                            >
                                                <div className="admin-comment__marker">
                                                    <span>{String(index + 1).padStart(2, "0")}</span>
                                                </div>
                                                <div className="admin-comment__body">
                                                    <div>
                                                        <strong>{comment.authorName || "익명"}</strong>
                                                        <span>
                                                            #{String(comment.id).padStart(4, "0")}
                                                        </span>
                                                    </div>
                                                    <p>{comment.content}</p>
                                                    <small>
                                                        게시글 /{" "}
                                                        {originalPost
                                                            ? originalPost.title
                                                            : `삭제된 게시글 #${comment.postId}`}
                                                    </small>
                                                    <button 
                                                    type="button"
                                                    className="delete-key"
                                                    onClick={() => handleCommentDelete(comment.id)}
                                                    >
                                                    삭제하기
                                                    </button>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </article>
                    </section>

                    <section
                        className="admin-panel admin-report-panel"
                        id="report-management"
                    >
                        <div className="admin-panel__header">
                            <div>
                                <span className="admin-section-code">REPORT.04 / MANAGEMENT</span>
                                <h2>신고 관리</h2>
                            </div>
                            <span className="admin-panel__count">{reports.length} REPORTS</span>
                        </div>

                        <div className="admin-report-table">
                            <div className="admin-report-table__head">
                                <span>REPORT ID</span>
                                <span>신고 대상 / 신고자</span>
                                <span>신고 사유</span>
                                <span>상태</span>
                                <span>관리</span>
                            </div>
                            {reports.length === 0 ? (
                                <div className="admin-empty-state">
                                    <strong>NO REPORTS YET</strong>
                                    <span>접수된 신고가 없습니다.</span>
                                </div>
                            ) : (
                                reports.map((report) => (
                                    <div className="admin-report-row" key={report.id}>
                                        <span className="admin-record-id">
                                            REPORT-{String(report.id).padStart(3, "0")}
                                        </span>
                                        <div className="admin-report-target">
                                            <strong>
                                                {report.targetType === "post" ? "게시글" : "댓글"}
                                                {" "}#{report.targetId}
                                            </strong>
                                            <span>신고자: {report.reporterName}</span>
                                            {report.postId !== null && (
                                                <Link to={`/posts/${report.postId}/detail`}>
                                                    원본 보기 ↗
                                                </Link>
                                            )}
                                        </div>
                                        <div className="admin-report-reason">
                                            <strong>{report.reason}</strong>
                                            <span>{report.content}</span>
                                        </div>
                                        <span className={`admin-report-status admin-report-status--${report.status}`}>
                                            {report.status === "pending" ? "대기 중" : "처리 완료"}
                                        </span>
                                        <div className="admin-report-actions">
                                            <button
                                                type="button"
                                                className="admin-resolve-button"
                                                disabled={report.status === "resolved"}
                                                onClick={() => handleReportResolve(report.id)}
                                            >
                                                처리 완료
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-danger-button"
                                                onClick={() => handleReportDelete(report.id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    <footer className="admin-footer">
                        <span>COMMUNITY ADMIN CENTER</span>
                        <span>POSTS / COMMENTS / MEMBERS</span>
                        <span>MANAGEMENT DASHBOARD ACTIVE</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default AdminDashBoard;
