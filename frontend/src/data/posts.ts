export interface Post {
    title: string;
    id: number;
    content: string;
}

export const posts: Post[] = [
    { title: "첫 글", id: 1, content: "안녕하세요." },
    { title: "연습용 글", id: 2, content: "게시판 예시 데이터입니다." },
    { title: "세 번째 글", id: 3, content: "필요하면 자유롭게 수정해도 됩니다." },
];
