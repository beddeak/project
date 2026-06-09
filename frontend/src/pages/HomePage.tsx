import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import "./HomePageStyle.css";


export function HomePage() {
    const authcontext = useContext(AuthContext);
    if (!authcontext) return (<p>회원정보에 오류가 생겼습니다</p>)
    const { user, logout } = authcontext
    const isAdmin = user?.role === "admin";
    return (
        <div className="HomePage">
            <div className="login-states">
                {user ? (
                    <div>
                    <p>로그인 상태:성공</p>
                    <p>유저 닉네임:{user.name}</p>
                    <p>유저 권한:{user.role}</p>
                    <button className="logout-button" type="button" onClick={logout}>
                        로그아웃
                    </button>
                    </div>
                ) : (
                    <div>
                        <p>로그인 상태:거부</p>
                        <Link to={`/login`}>로그인</Link>
                        <Link to={`/signup`}>회원가입</Link>
                    </div>
                )}
                <div className="posts">
                            <Link to={`/posts`}>글 목록</Link>
                </div>
                {user && (
                    <div>
                        <div className="myposts">
                            <Link to={`/mypage/posts`}>내 페이지</Link>
                            <Link to={`/posts/write`}>글 쓰기</Link>
                        </div>
                    </div>
                )}
                {isAdmin && (
                    <div>
                        <Link to={`/admin`}>관리자권한</Link>
                    </div>
                )}
            </div>
        </div>
    )

}

export default HomePage
