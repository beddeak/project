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
    addComment: (postId:number,content:string,authorId:number,authorName:string) => Promise<void>;
    deleteComment: (id:number) => Promise<void>;
    editComment: (id:number, content:string) => Promise<void>;

}

const CommentContext = createContext<CommentContextType | null>(null)


export function CommentContextProvider({children}: {children: React.ReactNode}) {
    const [comments,setComments] = useState<Comment[]>([])
    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch("http://localhost:3000/comments")
            const data = await response.json()

            setComments(data);
        }

        fetchComments();
    }, []);
    const addComment = async (
        postId:number,
        content:string,
        authorId:number,
        authorName:string
    ) => {
        const response = await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                postId,
                content,
                authorId,
                authorName
            })
        });
        const newComment = await response.json();

        setComments(prevComment => [...prevComment, newComment]);
    }
    const editComment = async (
        id:number,
        content:string
    ) => {
        const response = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content
            })
        });
        const edit = await response.json();

        setComments(prevComment => prevComment.map(comment => comment.id === id ? edit : comment))
    }

        const deleteComment = async (id:number) => {
        const response = await fetch(`http://localhost:3000/comments/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            alert("댓글 삭제에 실패했습니다")
            return;
        }
        setComments(prevComment => prevComment.filter(comment => comment.id !== id))
    }

    return (

        <CommentContext.Provider value={{comments,addComment,deleteComment,editComment}}>
            {children}
        </CommentContext.Provider>
    )
}

export default CommentContext;
