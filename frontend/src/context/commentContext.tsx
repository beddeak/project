import { createContext,useState,useEffect } from "react";
type Comment = {
    id:number,
    postId:number,
    content:string,
    authorId:number,
    authorName:string
}

type CommentContextType = {
    comments: Comment[]; 
    addComment: (postId:number,content:string) => Promise<void>;
    deleteComment: (id:number) => Promise<void>;
    editComment: (id:number, content:string) => Promise<void>;

}

const CommentContext = createContext<CommentContextType | null>(null)


export function CommentContextProvider({children}: {children: React.ReactNode}) {
    const [comments,setComments] = useState<Comment[]>([])
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch("http://localhost:3000/comments")

                if (!response.ok) {
                    alert("댓글을 불러오지 못했습니다")
                    return;
                }

                const data: Comment[] = await response.json()
                setComments(data);
            } catch {
                alert("댓글을 불러오는 중 오류가 발생했습니다")
            }
        }

        fetchComments();
    }, []);
    const addComment = async (
        postId:number,
        content:string
    ) => {
        try {
            const token = localStorage.getItem("accessToken")
            const response = await fetch("http://localhost:3000/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    postId,
                    content
                })
            });

            if (!response.ok) {
                alert("댓글 작성에 실패했습니다")
                return;
            }

            const newComment: Comment = await response.json();
            setComments(prevComment => [...prevComment, newComment]);
        } catch {
            alert("댓글 작성 중 오류가 발생했습니다")
        }
    }
    const editComment = async (
        id:number,
        content:string
    ) => {
        try {
            const token = localStorage.getItem("accessToken")
            const response = await fetch(`http://localhost:3000/comments/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    content
                })
            });

            if (!response.ok) {
                alert("댓글 수정에 실패했습니다")
                return;
            }

            const edit: Comment = await response.json();
            setComments(prevComment => prevComment.map(comment => comment.id === id ? edit : comment))
        } catch {
            alert("댓글 수정 중 오류가 발생했습니다")
        }
    }

    const deleteComment = async (id:number) => {
        try {
            const token = localStorage.getItem("accessToken")
            const response = await fetch(`http://localhost:3000/comments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                alert("댓글 삭제에 실패했습니다")
                return;
            }
            setComments(prevComment => prevComment.filter(comment => comment.id !== id))
        } catch {
            alert("댓글 삭제 중 오류가 발생했습니다")
        }
    }

    return (

        <CommentContext.Provider value={{comments,addComment,deleteComment,editComment}}>
            {children}
        </CommentContext.Provider>
    )
}

export default CommentContext;
