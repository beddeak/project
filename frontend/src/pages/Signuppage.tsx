import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

export default function SignupPage() {
    const navigate = useNavigate();

    const [name,setName] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");

    const handleSignup = async () => {
        if (!name.trim()) {
            alert("이름을 입력하세요")
            return;
        }
        if (!username.trim()) {
            alert("아이디를 입력하세요")
            return;
        }
        if (!password.trim()) {
            alert("비밀번호를 입력하세요")
            return;
        }
        if (!email.trim()) {
            alert("이메일을 입력하세요")
            return;
        }
        const response = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name.trim(),
                username: username.trim(),
                email: email.trim(),
                password,
            }),
        });
        if (!response.ok) {
            alert("회원가입에 실패했습니다 회원정보를 다시 확인해주세요")
            return;
        }

        alert("회원가입 완료되었습니다")
        navigate("/login");
    };

    return (
        <main className="signup-page">
            <section className="signup-card">
                <header className="signup-header">
                    <span className="signup-eyebrow">CREATE ACCOUNT</span>
                    <h1>회원가입</h1>
                    <p>커뮤니티를 시작하기 위한 정보를 입력해주세요.</p>
                </header>

                <form
                    className="signup-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleSignup();
                    }}
                >
                    <div className="signup-field">
                        <label htmlFor="signup-name">이름</label>
                        <input
                            id="signup-name"
                            autoComplete="name"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="signup-username">아이디</label>
                        <input
                            id="signup-username"
                            autoComplete="username"
                            placeholder="사용할 아이디를 입력하세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="signup-email">이메일</label>
                        <input
                            id="signup-email"
                            type="email"
                            autoComplete="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="signup-field">
                        <label htmlFor="signup-password">비밀번호</label>
                        <input
                            id="signup-password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="signup-submit" type="submit">
                        계정 만들기
                    </button>
                </form>

                <button className="signup-login-link" type="button" onClick={() => navigate("/login")}>
                    이미 계정이 있으신가요? 로그인
                </button>
            </section>
        </main>
    )
}
