import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}
    @Get()
    findAll() {
        return this.postsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        const postId = Number(id)
        return this.postsService.findOne(postId);
    }
}
