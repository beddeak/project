import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postsRepository: Repository<PostEntity>,
    ) {}
    async findAll(options?: {
        search?:string;
        sort?:string;
        page?:number;
        limit?:number;
    }
    ) {
        const search = options?.search?.trim().toLowerCase() ?? "";
        const sort = options?.sort ?? "latest";
        const page = Math.max(options?.page ?? 1, 1);
        const limit = Math.max(options?.limit ?? 5,1)
        let posts = await this.postsRepository.find();

        if (search) {
            posts = posts.filter((post) => 
                post.title.toLowerCase().includes(search) ||
                post.content.toLowerCase().includes(search) ||
                (post.authorName ?? "").toLowerCase().includes(search)
            )
        };
        const sortedPosts = [...posts].sort((a,b) => {
            if (sort === "latest") {
                return b.id - a.id
            }
            if (sort === "oldest") {
                return a.id - b.id
            }
            if (sort === "likes") {
                return (b.likedUserIds ?? []).length - (a.likedUserIds ?? []).length;
            }
            return b.id - a.id
        });
        const total = sortedPosts.length;
        const totalPages = Math.ceil(total / limit)
        const startIndex = (page - 1) * limit;
        const items = sortedPosts.slice(startIndex, startIndex + limit);

        return {
            total,
            totalPages,
            limit,
            page,
            items
        }
    }
    async findOne(id: number): Promise<PostEntity> {
        const post = await this.postsRepository.findOne({where: {id},
        });

        if (!post) {
            throw new NotFoundException("게시글을 찾을수가 없습니다")
        }

        return post;
    }

    async create(title:string,content:string,authorId:number,authorName:string): Promise<PostEntity> {
        const newPost = this.postsRepository.create({
            title,
            content,
            authorId,
            authorName,
            likedUserIds: [],
        });
        return await this.postsRepository.save(newPost);

    }
    async edit(id:number,title:string,content:string, userId:number,role: 'user' | 'admin'): Promise<PostEntity> {
        const post = await this.findOne(id);
        if (post.authorId !== userId && role !== 'admin') {
            throw new ForbiddenException('수정 권한이 없습니다')
        }

        post.title = title;
        post.content = content;

        return await this.postsRepository.save(post)
    }
    async remove(id:number,userId:number,role:'user' | 'admin'): Promise<PostEntity> {
        const post = await this.findOne(id)
        if (post.authorId !== userId && role !== 'admin') {
            throw new ForbiddenException('삭제 권한이 없습니다')
        }

        await this.postsRepository.remove(post);

        return post;
    }
    async toggleLike(postId:number,userId:number): Promise<PostEntity> {
        if (typeof userId !== "number" || Number.isNaN(userId)) {
            throw new BadRequestException("계정 관련으로 오류가 발생하였습니다")
        }
        const post = await this.findOne(postId);
        const likedUserIds = post.likedUserIds ?? [];
        const alreadyLiked = likedUserIds.includes(userId);

        post.likedUserIds = alreadyLiked
        ? likedUserIds.filter((id) => id !== userId)
        : [...likedUserIds, userId];

        return this.postsRepository.save(post);
    }
}
