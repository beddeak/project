import { Link } from "react-router-dom";
import PostContext from "../context/PostContext";
import "./PostListPageStyle.css";
import { useContext, useEffect, useRef, useState } from "react";

function PostListPage() {
    const [searchText, setSearchText] = useState("");
    const [currentPage,setCurrentPage] = useState(1);
    const postsPerPage = 5;
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const context = useContext(PostContext);

    useEffect(() => {
        if (isSearchOpen) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpen]);

    if (!context) return <p>해당 글을 찾을수가없습니다</p>;

    const { posts } = context;
    const normalizedSearchText = searchText.trim().toLocaleLowerCase();
    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(normalizedSearchText) ||
        post.content.toLowerCase().includes(normalizedSearchText) ||
        post.authorName.toLocaleLowerCase().includes(normalizedSearchText)
    );
    const totalPage = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1 ) * postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage); 
    const closeSearch = () => {
        setSearchText("");
        setIsSearchOpen(false);
    };

    return (
        <div className="post-list-page">
            <div className="post-list-header">
                <h1>글 목록</h1>
                <div className="post-list-actions">
                    <button
                        type="button"
                        className="search-toggle-button"
                        aria-label="게시글 검색 열기"
                        aria-expanded={isSearchOpen}
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m21 21-4.35-4.35m2.35-5.4a7.75 7.75 0 1 1-15.5 0 7.75 7.75 0 0 1 15.5 0Z" />
                        </svg>
                    </button>
                    <Link className="write-button" to="/posts/write">
                        글 쓰기
                    </Link>
                </div>
            </div>

            {isSearchOpen && (
                <div className="post-search">
                    <svg className="post-search-icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m21 21-4.35-4.35m2.35-5.4a7.75 7.75 0 1 1-15.5 0 7.75 7.75 0 0 1 15.5 0Z" />
                    </svg>
                    <input
                        ref={searchInputRef}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="제목, 내용, 작성자로 검색"
                        aria-label="게시글 검색"
                    />
                    <button
                        type="button"
                        className="search-close-button"
                        aria-label="검색 닫기"
                        onClick={closeSearch}
                    >
                        &times;
                    </button>
                </div>
            )}

            {posts.length === 0 ? (
                <p>작성된 글이 없습니다</p>
            ) : filteredPosts.length === 0 ? (
                <p className="search-empty">검색 결과가 없습니다</p>
            ) : (
                filteredPosts.map((post) => (
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
