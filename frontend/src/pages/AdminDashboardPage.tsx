import { useContext } from "react";
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

export function AdminDashBoard() {
    const authcontext = useContext(AuthContext);
    const commentcontext = useContext(CommentContext);
    const postcontext = useContext(PostContext);

    if (!authcontext || !postcontext || !commentcontext) {
        return <p>관리자 데이터를 불러올 수 없습니다.</p>;
    }

    const { user, logout } = authcontext;
    const { comments } = commentcontext;
    const { posts } = postcontext;
    const totalLikes = posts.reduce((sum, post) => sum + post.likedUserIds.length, 0);
    const activeAuthors = new Set(posts.map((post) => post.authorId)).size;
    const commentsNeedingReview = comments.filter(
        (comment) => !posts.some((post) => post.id === comment.postId),
    ).length;

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
                    <Link className="admin-nav__item" to="/posts">
                        <span>04</span>
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
                                <span>REVIEW REQUIRED</span>
                                <strong>{String(commentsNeedingReview).padStart(2, "0")}</strong>
                                <small>검토 필요 댓글</small>
                            </div>
                            <em>{totalLikes} TOTAL LIKES</em>
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
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>
                        </article>
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
