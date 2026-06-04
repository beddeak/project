    import { Injectable, NotFoundException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { CommentsEntity } from './comments.entity';
    import { Repository } from 'typeorm';

    @Injectable()
    export class CommentsService {
        constructor(
            @InjectRepository(CommentsEntity)
            private readonly commentsRepository: Repository<CommentsEntity>,
        ) {}
        async findAll(): Promise<CommentsEntity[]> {
            return await this.commentsRepository.find();
        }

        async findOne(id: number): Promise<CommentsEntity> {
            const comment = await this.commentsRepository.findOne({
                where: {id},
            });

            if (!comment) {
                throw new NotFoundException("댓글을 찾을수가 없습니다")
            }

            return comment;
        }

        async findByPostId(postId: number): Promise<CommentsEntity[]> {
            return await this.commentsRepository.find({
                where: {postId}
            });
        }
        async create(postId:number, content:string, authorId:number, authorName:string): Promise<CommentsEntity> {
            const comment = this.commentsRepository.create({
                postId,
                content,
                authorId,
                authorName
            });
            return await this.commentsRepository.save(comment);
        }
        async edit(id:number, content:string): Promise<CommentsEntity> {
            const comment = await this.findOne(id)

            comment.content = content;

            return await this.commentsRepository.save(comment);
        }

        async remove(id: number): Promise<CommentsEntity> {
            const comment = await this.findOne(id);

            await this.commentsRepository.remove(comment);

            return comment;
        }
    }
