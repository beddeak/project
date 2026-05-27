import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentsService {
    private comments = [
        {id:1,postId:1,content:"뭐하냐",authorId:1,authorName:"test1"},
        {id:2,postId:1,content:"정지",authorId:2,authorName:"admin1"},
        {id:3,postId:2,content:"흠",authorId:1,authorName:"test1"},
    ];
    findOne(id:number) {
        const comment = this.comments.find(comment => comment.id === id)

        if (!comment) {
            throw new NotFoundException("댓글이 없습니다")
        }
        return comment;
    }
    findAll() {
        return this.comments
    }
    findByPostId(postId: number) {
        const commentFilter = this.comments.filter(comment => comment.postId === postId)

        return commentFilter
    }
    create(postId:number,content:string,authorId:number,authorName:string) {
        const ids = this.comments.map(comment => comment.id)
        const newId = ids.length === 0 ? 1 : Math.max(...ids) + 1

        const newComment = {
            id: newId,
            postId,
            content,
            authorId,
            authorName
        }
        this.comments = ([...this.comments,newComment])
        return newComment
    }
    edit(id: number, content:string) {
        const comment = this.findOne(id)
        const edited = this.comments.map(item => {
            if (item.id !== id) {
                return item
            } else {
                return {...comment,content}
            }
        })
        this.comments = edited
        return {
            ...comment,
            content
        }
    }
    remove(id: number) {
        const comment = this.findOne(id)
        const del = this.comments.filter(comment => comment.id !== id)
       this.comments = del
       return comment
    }
}
