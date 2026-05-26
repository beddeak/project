import { useState } from "react";
import "./PostFormStyle.css";

type PostFormProps = {
    initialTitle?: string;
    initialContent?: string;
    onSubmit: (title: string, content: string) => void;
};

function PostForm({
    initialTitle = "",
    initialContent = "",
    onSubmit,
}: PostFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        if (!content.trim()) {
            alert("내용을 입력하세요.");
            return;
        }

        onSubmit(title, content);
    };

    return (
        <div className="write-page">
            <header className="set-title">
                <label>제목</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </header>
            <div className="set-content">
                <label>내용</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="write-actions">
                <button type="button" onClick={handleSubmit}>
                    저장하기
                </button>
            </div>
        </div>
    );
}

export default PostForm;
