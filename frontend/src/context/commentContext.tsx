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
            const respone = await fetch("http://localhost:3000/comments")
            const data = await respone.json()

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
        const respone = await fetch("http://localhost:3000/comments", {
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
        const newComment = await respone.json();

        setComments(prevComment => [prevComment, newComment]);
    }

    const editComment = (id:number, content:string) => {
        const edited = comments.map(comment => {
            if (comment.id !== id) {
                return comment;
            } else {
                return {...comment,content:content}
            }
        })
        setComments(edited);
    }

        const deleteComment = (id:number) => {
        const filtered = comments.filter(comment => comment.id !== id);
        setComments(filtered)
    }

    return (

        <CommentContext.Provider value={{comments,addComment,deleteComment,editComment}}>
            {children}
        </CommentContext.Provider>
    )
}

export default CommentContext;
