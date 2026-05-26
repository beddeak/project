import { createContext,useState } from "react";
type Comment = {
    id:number,
    postId:number,
    content:string,
    authorId:number,
    authorName:string
}

type CommentContextType = {
    comments: Comment[]; 
    addComment: (postId:number,content:string,authorId:number,authorName:string) => void;
    deleteComment: (id:number) => void;

    editComment: (id:number, content:string) => void;

}

const CommentContext = createContext<CommentContextType | null>(null)


export function CommentContextProvider({children}: {children: React.ReactNode}) {
    const [comments,setComments] = useState<Comment[]>([
        {id:1,postId:1,content:"뭐하냐",authorId:1,authorName:"test1"},
        {id:2,postId:1,content:"정지",authorId:2,authorName:"admin1"},
        {id:3,postId:2,content:"흠",authorId:1,authorName:"test1"},
    ])
    const addComment = (postId:number,content:string,authorId:number,authorName:string) => {
        const Ids = comments.map(comment => comment.id)
        const newId = Ids.length === 0 ? 1 : Math.max(...Ids) + 1;
        const newComment = {
            id: newId,
            postId,
            content,
            authorId,
            authorName
        };

        setComments([...comments,newComment])
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