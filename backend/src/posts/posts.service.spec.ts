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
        const repository = {
            find: jest.fn().mockResolvedValue(posts),
        } as unknown as Repository<PostEntity>;
        const service = new PostsService(repository);

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
});

function createPost(
    id: number,
    title: string,
    content: string,
    authorName: string,
    likeCount: number,
): PostEntity {
    return {
        id,
        title,
        content,
        authorId: id,
        authorName,
        likedUserIds: Array.from({ length: likeCount }, (_, index) => index + 1),
    };
}
