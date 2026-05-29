import {  createContext,useEffect,useState } from "react";

type Post = {
    id:number;
    title:string;
    content:string;
    authorId:number;
    authorName:string;
    likedUserIds: number[];
}

type PostContextType = {
    posts: Post[]
    addPost: (title:string, content:string, authorId:number, authorName:string) => void;
    editPost: (id:number, title:string, content:string) => void;
    deletePost: (id:number) => void;
    toggleLike: (postId:number,userId:number) => void;
}

const PostContext = createContext<PostContextType | null>(null)


export function PostContextProvider({children}: {children: React.ReactNode}) {
    const [posts, setPosts] = useState<Post[]>([])
    useEffect(() => {
        const fetchPosts = async () => {
            const response  = await fetch("http://localhost:3000/posts");
            const data = await response.json();

            setPosts(data);
        };

        fetchPosts();
    }, []);

     const addPost = (title:string,content:string,authorId:number,authorName:string) => {
        const Ids = posts.map(post => post.id)
        const newId = Ids.length === 0 ? 1 : Math.max(...Ids) + 1
        const newPost = {
            id:newId,
            title,
            content,
            authorId,
            authorName,
            likedUserIds: []
        }
        setPosts([...posts, newPost])
    }
    const editPost = (id:number,title:string,content:string) => {
        const edited = posts.map(post => {
            if (post.id !== id) {
                return post;
            } else {
                return {...post, title:title,content:content}
            }
        }
        )
        setPosts(edited);
    }
    const deletePost = (id:number) => {
        const del = posts.filter(post => post.id !== id)
        setPosts(del)
    }
    const toggleLike = (postId:number, userId:number) => {
        const like = posts.map(post => {
            if (post.id !== postId) {
                return post;
            }
            const alreadyLiked = post.likedUserIds.includes(userId);

            if (alreadyLiked) {
                return {
                ...post,
                likedUserIds: post.likedUserIds.filter(id => id !== userId)
                }
            } else {
                return {
                    ...post,
                    likedUserIds: [...post.likedUserIds, userId]
                }
            }
        })
        setPosts(like)
    }
    return (
        <PostContext.Provider value={{posts,editPost,addPost,deletePost,toggleLike}}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContext
