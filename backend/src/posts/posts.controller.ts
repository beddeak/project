import { Body, Controller, Get, Param, Patch, Post,Delete,ParseIntPipe} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ToggleLikeDto } from './dto/like-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}
    @Get()
    findAll() {
        return this.postsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id);
    }
    @Post()
    create(@Body() body: CreatePostDto) {
        return this.postsService.create(
            body.title,
            body.content,
            body.authorId,
            body.authorName,
        );
    }
    @Patch(':id')
    edit(@Param('id', ParseIntPipe) id:number,@Body() body: UpdatePostDto) {
        
        return this.postsService.edit(
            id,
            body.title,
            body.content,
        )
    }
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:number) {


        return this.postsService.remove(id)
    }
    @Patch(':id/like')
    toggleLike(@Param('id', ParseIntPipe) id: number, @Body() body: ToggleLikeDto) {

        return this.postsService.toggleLike(
            id,
            body.userId
        )
    }
}
