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

    it('creates posts with the authenticated user as author', async () => {
        const create = jest.fn();
        const controller = new PostsController({
            create,
        } as unknown as PostsService);
        const request = createRequest({ sub: 7, name: 'Alice', role: 'user' });

        await controller.create(request, {
            title: 'Hello',
            content: 'Body',
        });

        expect(create).toHaveBeenCalledWith('Hello', 'Body', 7, 'Alice');
    });

    it('passes authenticated user context when editing posts', async () => {
        const edit = jest.fn();
        const controller = new PostsController({
            edit,
        } as unknown as PostsService);
        const request = createRequest({ sub: 7, name: 'Alice', role: 'admin' });

        await controller.edit(request, 1, {
            title: 'Changed',
            content: 'Changed body',
        });

        expect(edit).toHaveBeenCalledWith(1, 'Changed', 'Changed body', 7, 'admin');
    });

    it('uses the authenticated user id when toggling likes', async () => {
        const toggleLike = jest.fn();
        const controller = new PostsController({
            toggleLike,
        } as unknown as PostsService);
        const request = createRequest({ sub: 7, name: 'Alice', role: 'user' });

        await controller.toggleLike(request, 1);

        expect(toggleLike).toHaveBeenCalledWith(1, 7);
    });
});

function createRequest(user: {
    sub: number;
    name: string;
    role: 'user' | 'admin';
}) {
    return {
        user: {
            ...user,
            email: 'user@example.com',
        },
    } as Parameters<PostsController['create']>[0];
}
