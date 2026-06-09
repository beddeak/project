import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CommentContext from "../context/commentContext";
import PostContext from "../context/PostContext";
import "./AdminDashboardPage.css";

function SecurityMark() {
    return (
        <div className="admin-security-mark" aria-hidden="true">
            <span className="admin-security-mark__ring" />
            <span className="admin-security-mark__core">05</span>
            <span className="admin-security-mark__line admin-security-mark__line--one" />
            <span className="admin-security-mark__line admin-security-mark__line--two" />
            <span className="admin-security-mark__line admin-security-mark__line--three" />
        </div>
    );
}

function StatusIcon({ type }: { type: "archive" | "signal" | "person" | "shield" }) {
    const paths = {
        archive: (
            <>
                <path d="M4 7.5h16v12H4z" />
                <path d="M3 4.5h18v3H3zM9 11.5h6" />
            </>
        ),
        signal: (
            <>
                <path d="M4 18v2M8 14v6M12 10v10M16 6v14M20 3v17" />
            </>
        ),
        person: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
            </>
        ),
        shield: (
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
    const orphanComments = comments.filter(
        (comment) => !posts.some((post) => post.id === comment.postId),
    ).length;

    return (
        <div className="admin-dashboard">
            <div className="admin-dashboard__noise" aria-hidden="true" />

            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <SecurityMark />
                    <div>
                        <span className="admin-eyebrow">SCP FOUNDATION</span>
                        <strong>OVERSEER</strong>
                        <small>COMMAND TERMINAL</small>
                    </div>
                </div>

                <div className="admin-clearance">
                    <span>CLEARANCE</span>
                    <strong>LEVEL 5</strong>
                    <small>O5 COUNCIL EYES ONLY</small>
                </div>

                <nav className="admin-nav" aria-label="관리자 메뉴">
                    <a className="admin-nav__item admin-nav__item--active" href="#overview">
                        <span>01</span>
                        통제 현황
                    </a>
                    <a className="admin-nav__item" href="#post-archive">
                        <span>02</span>
                        기록 보관소
                    </a>
                    <a className="admin-nav__item" href="#comment-feed">
                        <span>03</span>
                        통신 감청
                    </a>
                    <Link className="admin-nav__item" to="/posts">
                        <span>04</span>
                        공개 기록 열람
                    </Link>
                </nav>

                <div className="admin-sidebar__footer">
                    <div className="admin-system-status">
                        <span className="admin-live-dot" />
                        <div>
                            <strong>SITE NETWORK</strong>
                            <small>모든 시스템 정상</small>
                        </div>
                    </div>
                    <button type="button" className="admin-logout" onClick={logout}>
                        세션 종료
                        <span>↗</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-topbar__location">
                        <span>SECURE TERMINAL</span>
                        <strong>KR-SITE / CONTROL-05</strong>
                    </div>
                    <div className="admin-topbar__right">
                        <div className="admin-classified">
                            <span>CLASSIFIED</span>
                            <strong>THAUMIEL</strong>
                        </div>
                        <div className="admin-operator">
                            <span>O5</span>
                            <div>
                                <small>AUTHORIZED OPERATOR</small>
                                <strong>{user?.name ?? "UNKNOWN"}</strong>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="admin-content">
                    <section className="admin-hero" id="overview">
                        <div>
                            <span className="admin-section-code">SYS.01 / OVERVIEW</span>
                            <h1>
                                관리자 통제실
                                <small>ADMINISTRATIVE COMMAND</small>
                            </h1>
                            <p>
                                인가된 O5 감독관 세션입니다. 모든 접근과 기록 열람은
                                자동으로 보안 로그에 저장됩니다.
                            </p>
                        </div>
                        <div className="admin-alert-level">
                            <div className="admin-alert-level__dial">
                                <span>II</span>
                            </div>
                            <div>
                                <small>CURRENT THREAT LEVEL</small>
                                <strong>제한적 경계</strong>
                                <span>CONDITION VIOLET</span>
                            </div>
                        </div>
                    </section>

                    <section className="admin-stats" aria-label="관리 현황 통계">
                        <article className="admin-stat-card">
                            <StatusIcon type="archive" />
                            <div>
                                <span>ARCHIVED RECORDS</span>
                                <strong>{String(posts.length).padStart(2, "0")}</strong>
                                <small>등록된 게시글</small>
                            </div>
                            <em>+ LIVE</em>
                        </article>
                        <article className="admin-stat-card">
                            <StatusIcon type="signal" />
                            <div>
                                <span>INTERCEPTED SIGNALS</span>
                                <strong>{String(comments.length).padStart(2, "0")}</strong>
                                <small>등록된 댓글</small>
                            </div>
                            <em>MONITORED</em>
                        </article>
                        <article className="admin-stat-card">
                            <StatusIcon type="person" />
                            <div>
                                <span>ACTIVE PERSONNEL</span>
                                <strong>{String(activeAuthors).padStart(2, "0")}</strong>
                                <small>활동 기록 작성자</small>
                            </div>
                            <em>VERIFIED</em>
                        </article>
                        <article className="admin-stat-card admin-stat-card--warning">
                            <StatusIcon type="shield" />
                            <div>
                                <span>SECURITY FLAGS</span>
                                <strong>{String(orphanComments).padStart(2, "0")}</strong>
                                <small>원본 미확인 댓글</small>
                            </div>
                            <em>{totalLikes} SIGNALS</em>
                        </article>
                    </section>

                    <section className="admin-grid">
                        <article className="admin-panel admin-panel--records" id="post-archive">
                            <div className="admin-panel__header">
                                <div>
                                    <span className="admin-section-code">ARC.02 / DATABASE</span>
                                    <h2>기록 보관소</h2>
                                </div>
                                <span className="admin-panel__count">{posts.length} FILES</span>
                            </div>

                            <div className="admin-record-table">
                                <div className="admin-record-table__head">
                                    <span>FILE ID</span>
                                    <span>기록명 / 작성자</span>
                                    <span>신호</span>
                                    <span>접근</span>
                                </div>
                                {posts.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <strong>NO RECORDS DETECTED</strong>
                                        <span>현재 보관된 기록이 없습니다.</span>
                                    </div>
                                ) : (
                                    posts.slice(0, 6).map((post) => (
                                        <div className="admin-record-row" key={post.id}>
                                            <span className="admin-record-id">
                                                SCP-{String(post.id).padStart(3, "0")}
                                            </span>
                                            <div className="admin-record-title">
                                                <strong>{post.title}</strong>
                                                <span>BY {post.authorName || "UNKNOWN"}</span>
                                            </div>
                                            <span className="admin-record-likes">
                                                {post.likedUserIds.length} ACK
                                            </span>
                                            <Link
                                                className="admin-inspect-link"
                                                to={`/posts/${post.id}/detail`}
                                            >
                                                열람
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
                                    <span className="admin-section-code">COM.03 / LIVE FEED</span>
                                    <h2>통신 감청 기록</h2>
                                </div>
                                <span className="admin-live-label">
                                    <span className="admin-live-dot" />
                                    LIVE
                                </span>
                            </div>

                            <div className="admin-comment-feed">
                                {comments.length === 0 ? (
                                    <div className="admin-empty-state">
                                        <strong>CHANNEL SILENT</strong>
                                        <span>감지된 통신 기록이 없습니다.</span>
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
                                                        <strong>{comment.authorName || "ANONYMOUS"}</strong>
                                                        <span>
                                                            #{String(comment.id).padStart(4, "0")}
                                                        </span>
                                                    </div>
                                                    <p>{comment.content}</p>
                                                    <small>
                                                        TARGET /{" "}
                                                        {originalPost
                                                            ? originalPost.title
                                                            : `DELETED RECORD ${comment.postId}`}
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
                        <span>FOUNDATION SECURE INTRANET</span>
                        <span>SESSION ENCRYPTION: AES-256 / ACTIVE</span>
                        <span>REMEMBER: SECURE. CONTAIN. PROTECT.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default AdminDashBoard;
