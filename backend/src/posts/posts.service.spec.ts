import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './posts.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
    it('searches title, content, and author before sorting and paginating', async () => {
        const posts = [
            createPost(1, 'Hello title', 'first body', 'Alice', 1),
            createPost(2, 'Second title', 'HELLO body', 'Bob', 3),
            createPost(3, 'Third title', 'third body', 'Hello writer', 2),
            createPost(4, 'Unrelated', 'nothing here', 'Charlie', 4),
        ];
        const service = new PostsService(createRepository({ find: jest.fn().mockResolvedValue(posts) }));

        const result = await service.findAll({
            search: ' hello ',
            sort: 'likes',
            page: 1,
            limit: 2,
        });

        expect(result.total).toBe(3);
        expect(result.totalPages).toBe(2);
        expect(result.items.map((post) => post.id)).toEqual([2, 3]);
    });

    it('blocks editing by users who are not the author or admin', async () => {
        const post = createPost(1, 'Original', 'body', 'Alice', 0, 10);
        const service = new PostsService(createRepository({
            findOne: jest.fn().mockResolvedValue(post),
        }));

        await expect(
            service.edit(post.id, 'Changed', 'changed body', 99, 'user'),
        ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('allows the author to edit a post', async () => {
        const post = createPost(1, 'Original', 'body', 'Alice', 0, 10);
        const save = jest.fn().mockImplementation((savedPost: PostEntity) => Promise.resolve(savedPost));
        const service = new PostsService(createRepository({
            findOne: jest.fn().mockResolvedValue(post),
            save,
        }));

        const result = await service.edit(post.id, 'Changed', 'changed body', 10, 'user');

        expect(result.title).toBe('Changed');
        expect(result.content).toBe('changed body');
        expect(save).toHaveBeenCalledWith(post);
    });

    it('allows an admin to remove another users post', async () => {
        const post = createPost(1, 'Original', 'body', 'Alice', 0, 10);
        const remove = jest.fn().mockResolvedValue(post);
        const service = new PostsService(createRepository({
            findOne: jest.fn().mockResolvedValue(post),
            remove,
        }));

        const result = await service.remove(post.id, 99, 'admin');

        expect(result).toBe(post);
        expect(remove).toHaveBeenCalledWith(post);
    });

    it('uses the authenticated user id when toggling likes', async () => {
        const post = createPost(1, 'Original', 'body', 'Alice', 0, 10);
        const save = jest.fn().mockImplementation((savedPost: PostEntity) => Promise.resolve(savedPost));
        const service = new PostsService(createRepository({
            findOne: jest.fn().mockResolvedValue(post),
            save,
        }));

        const result = await service.toggleLike(post.id, 20);

        expect(result.likedUserIds).toEqual([20]);
        expect(save).toHaveBeenCalledWith(post);
    });

    it('rejects invalid like user ids', async () => {
        const service = new PostsService(createRepository({}));

        await expect(service.toggleLike(1, Number.NaN)).rejects.toBeInstanceOf(BadRequestException);
    });
});

function createRepository(methods: Partial<Repository<PostEntity>>): Repository<PostEntity> {
    return methods as Repository<PostEntity>;
}

function createPost(
    id: number,
    title: string,
    content: string,
    authorName: string,
    likeCount: number,
    authorId = id,
): PostEntity {
    return {
        id,
        title,
        content,
        authorId,
        authorName,
        likedUserIds: Array.from({ length: likeCount }, (_, index) => index + 1),
    };
}
