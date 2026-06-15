import { createContext, useCallback, useEffect, useRef, useState } from "react";

type Post = {
    id:number;
    title:string;
    content:string;
    authorId:number;
    authorName:string;
    likedUserIds: number[];
}


type PostResponse = {
    items: Post[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

type PostContextType = {
    posts: Post[]
    total:number;
    totalPage:number;
    currentPage:number;
    fetchPost: (
        search?: string,
        sort?:string,
        page?:number,
        limit?:number
    ) => Promise<void>;
    addPost: (title:string, content:string, authorId:number, authorName:string) => Promise<boolean>;
    editPost: (id:number, title:string, content:string) => Promise<void>;
    deletePost: (id:number) => Promise<void>;
    toggleLike: (postId:number,userId:number) => Promise<void>;
}

const PostContext = createContext<PostContextType | null>(null)


export function PostContextProvider({children}: {children: React.ReactNode}) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const latestFetchRequest = useRef(0);

    const fetchPost = useCallback(async (
        search = "",
        sort = "latest",
        page = 1,
        limit = 5
    ) => {
        const requestId = ++latestFetchRequest.current;
        const query = new URLSearchParams({
            search,
            sort,
            page: String(page),
            limit: String(limit),
        });
        const response = await fetch(`http://localhost:3000/posts?${query.toString()}`);

        if (!response.ok) {
            alert("게시글을 불러오지 못했습니다")
            return; 
        }
        const data: PostResponse = await response.json();

        if (requestId !== latestFetchRequest.current) return;

        setPosts(data.items);
        setTotal(data.total);
        setTotalPage(data.totalPages);
        setCurrentPage(data.page);
    }, []);

    useEffect(() => {
        void Promise.resolve().then(() => fetchPost());
    }, [fetchPost]);
    
     const addPost = async (
        title:string,
        content:string,
        authorId:number,
        authorName: string
     ) => {
        const response = await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                content,
                authorId,
                authorName
            })
        });
        if (!response.ok) {
            alert("게시글 작성에 실패했습니다");
            return false;
        }

        await fetchPost("", "latest", 1, 5);
        return true;
     };
    const editPost = async (
        id:number,
        title:string,
        content:string
    ) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                content
            })
        });
        const edit = await response.json();

        setPosts(prevPost => prevPost.map(post => post.id === id ? edit : post))
    }
    const deletePost = async (
        id:number
    ) => {
        const response = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            alert("글 삭제에 실패했습니다");
            return;
        }

        await fetchPost("", "latest", 1, 5)
    }
    const toggleLike = async (
        postId:number,
        userId:number
    ) => {
        const response = await fetch(`http://localhost:3000/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId
            })
        });
        const updatedPost = await response.json();
        setPosts(prevPost => prevPost.map(post => (
            post.id === postId ? updatedPost : post
        )
        ));
    }
    return (
        <PostContext.Provider value={{posts,currentPage,total,totalPage,fetchPost,editPost,addPost,deletePost,toggleLike}}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContext
