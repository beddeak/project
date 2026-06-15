import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
    it('passes list query options to the posts service', async () => {
        const findAll = jest.fn().mockResolvedValue({ items: [] });
        const controller = new PostsController({
            findAll,
        } as unknown as PostsService);

        await controller.findAll('hello', 'likes', 2, 10);

        expect(findAll).toHaveBeenCalledWith({
            search: 'hello',
            sort: 'likes',
            page: 2,
            limit: 10,
        });
    });
});
