import { Body, Controller, Get, Param, Patch, Post,Delete, BadRequestException } from '@nestjs/common';
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
    @Post()
    create(@Body() body: any) {
        if (!body?.title || !body?.content || body?.authorId === undefined) {
            throw new BadRequestException("필수 값이 없습니다")
        }
        return this.postsService.create(
            body.title,
            body.content,
            body.authorId,
            body.authorName,
        );
    }
    @Patch(':id')
    edit(@Param('id') id:string,@Body() body: any) {
        const postId = Number(id)
        
        return this.postsService.edit(
            postId,
            body.title,
            body.content,
        )
    }
    @Delete(':id')
    remove(@Param('id') id:string) {
        const postId = Number(id)


        return this.postsService.remove(postId)
    }
    @Patch(':id/like')
    toggleLike(@Param('id') id: string, @Body() body: any) {
        const postId = Number(id)

        return this.postsService.toggleLike(
            postId,
            body.userId
        )
    }
}
