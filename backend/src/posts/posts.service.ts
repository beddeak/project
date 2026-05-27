import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsService {
    private posts = [
        {id:1,title:"안녕하시지",content:"유니유니입니다", authorId:1,authorName:"test1",likedUserIds:[]},
        {id:2,title:"반갑꼬리", content:"헤비가 누군데?", authorId:2, authorName:"admin1",likedUserIds:[]},
        {id:3,title:"김찬호 방송켜라",content:"김찬호 무자식", authorId:1, authorName:"test1",likedUserIds:[]},
        {id:4,title:"정상길",content:"정실", authorId:3,authorName:"test2",likedUserIds:[]},
        {id:5,title:"귀염둥이카페손인욱",content:"오고곡", authorId:4, authorName:"test3",likedUserIds:[]}
    ];
    findOne(id: number) {
        const post = this.posts.find(post => post.id === id)

        if (!post) {
            throw new NotFoundException("게시글을 찾을수가 없습니다")
        }

        return post;
    }

    findAll() {
        return this.posts;
    }
    create(title:string,content:string,authorId:number,authorName:string) {
        const ids = this.posts.map(post => post.id);
        const newId = ids.length === 0 ? 1 : Math.max(...ids) + 1

        const newPost = {
            id: newId,
            title,
            content,
            authorId,
            authorName,
            likedUserIds: []
        }
        this.posts = ([...this.posts, newPost])
        return newPost
    }
    edit(id:number,title:string,content:string) {
        const post = this.findOne(id)

        const edited = this.posts.map(item => {
            if (item.id !== id) {
                return post;
            } else {
                return {...post,title,content}
            }
        })
        this.posts = edited;

        return {
            ...post,
            title,
            content
        };
    }
    remove(id:number) {
        const post = this.findOne(id)

        const del = this.posts.filter(item => item.id !== id)
        this.posts = del
        return post;
    }

}
