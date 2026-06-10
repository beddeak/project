import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import PostContext from "../context/PostContext";
import "./HomePageStyle.css";

export function HomePage() {
    const authContext = useContext(AuthContext);
    const postContext = useContext(PostContext);

    if (!authContext || !postContext) {
        return <p>홈페이지 정보를 불러오지 못했습니다.</p>;
    }

    const { user, logout } = authContext;
    const { posts } = postContext;
    const isAdmin = user?.role === "admin";
    const authorCount = new Set(posts.map((post) => post.authorId)).size;
    const popularPosts = [...posts]
        .sort(
            (a, b) =>
                b.likedUserIds.length - a.likedUserIds.length ||
                b.id - a.id
        )
        .slice(0, 5);
    const myPosts = user
        ? posts.filter((post) => post.authorId === user.id)
        : [];
    const myReceivedLikes = myPosts.reduce(
        (sum, post) => sum + post.likedUserIds.length,
        0
    );
    const totalLikes = posts.reduce(
        (sum, post) => sum + post.likedUserIds.length,
        0
    );

    return (
        <div className="HomePage">
            <main className="home-layout">
                <section className="home-content">
                    <div className="home-hero">
                        <span className="home-eyebrow">Community Board</span>
                        <h1>커뮤니티<br />사이트</h1>
                        <p>
                            생각을 기록하고, 다른 사람의 이야기를 발견하고,
                            마음에 드는 글에 응원을 남겨보세요.
                        </p>
                        <div className="home-actions">
                            <Link className="home-primary-link" to="/posts">
                                글 목록 보기
                            </Link>
                            {user ? (
                                <Link className="home-secondary-link" to="/posts/write">
                                    새 글 작성
                                </Link>
                            ) : (
                                <Link className="home-secondary-link" to="/login">
                                    로그인
                                </Link>
                            )}
                        </div>
                    </div>

                    <section className="home-stats" aria-label="게시판 현황">
                        <article>
                            <span>게시글</span>
                            <strong>{posts.length}</strong>
                            <p>지금까지 공유된 이야기</p>
                        </article>
                        <article>
                            <span>작성자</span>
                            <strong>{authorCount}</strong>
                            <p>게시판에 참여한 사람</p>
                        </article>
                        <article>
                            <span>좋아요</span>
                            <strong>{totalLikes}</strong>
                            <p>서로에게 보낸 응원</p>
                        </article>
                    </section>

                    {isAdmin && (
                        <section className="admin-callout">
                            <div>
                                <span>Admin access</span>
                                <h2>커뮤니티 관리가 필요하신가요?</h2>
                            </div>
                            <Link to="/admin">관리자 대시보드</Link>
                        </section>
                    )}
                </section>

                <aside className="home-sidebar">
                    <section className="profile-card">
                        <div className="profile-card__status">
                            <span className={user ? "status-dot online" : "status-dot"} />
                            {user ? "로그인됨" : "게스트"}
                        </div>
                        {user ? (
                            <>
                                <div className="profile-card__identity">
                                    <span className="profile-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                    <div>
                                        <h2>{user.name}</h2>
                                        <p>{user.role === "admin" ? "관리자" : "일반 회원"}</p>
                                    </div>
                                </div>
                                <div className="profile-card__summary">
                                    <div>
                                        <span>내 게시글</span>
                                        <strong>{myPosts.length}</strong>
                                    </div>
                                    <div>
                                        <span>받은 좋아요</span>
                                        <strong>{myReceivedLikes}</strong>
                                    </div>
                                </div>
                                <div className="profile-card__actions">
                                    <Link to="/mypage/posts">내 페이지</Link>
                                    <button type="button" onClick={logout}>로그아웃</button>
                                </div>
                            </>
                        ) : (
                            <div className="guest-card">
                                <h2>아직 로그인하지 않았어요</h2>
                                <p>로그인하고 글쓰기와 내 페이지를 이용해보세요.</p>
                                <div className="profile-card__actions">
                                    <Link to="/login">로그인</Link>
                                    <Link to="/signup">회원가입</Link>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="popular-posts-card">
                        <header>
                            <div>
                                <span>Popular Posts</span>
                                <h2>인기글</h2>
                            </div>
                            <small>좋아요 기준</small>
                        </header>
                        {popularPosts.length === 0 ? (
                            <p className="popular-posts-empty">첫 번째 글을 기다리고 있습니다.</p>
                        ) : (
                            <ol>
                                {popularPosts.map((post, index) => (
                                    <li key={post.id}>
                                        <span className="popular-post-rank">{index + 1}</span>
                                        <Link
                                            className="popular-post-link"
                                            to={`/posts/${post.id}/detail`}
                                        >
                                            <strong>{post.title}</strong>
                                            <small>{post.authorName}</small>
                                        </Link>
                                        <span className="popular-post-likes">
                                            {post.likedUserIds.length}
                                            <small>Likes</small>
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </aside>
            </main>
        </div>
    );
}

export default HomePage;
