<<<<<<< HEAD
import { Body, Controller, Get, Param, Patch, Post,Delete } from '@nestjs/common';
=======
import { Controller, Get, Param } from '@nestjs/common';
>>>>>>> 5c31fd17820cf123bbb01958b88429dd848236bd
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
<<<<<<< HEAD
    @Post()
    create(@Body() body: any) {
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
=======
    @Get()
>>>>>>> 5c31fd17820cf123bbb01958b88429dd848236bd
}
