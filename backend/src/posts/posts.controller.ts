import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { UseGuards,Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/JwTAuth.guard';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ToggleLikeDto } from './dto/like-post.dto';

type AuthenticatedRequest = Request & {
    user: {
        sub:number;
        email:string;
        role:'user' | 'admin';
    }
}

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}
    @Get()
    findAll(
        @Query('search', new DefaultValuePipe('')) search: string,
        @Query('sort', new DefaultValuePipe('latest')) sort: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    ) {
        return this.postsService.findAll({ search, sort, page, limit });
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postsService.findOne(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Req() req:AuthenticatedRequest, @Body() body: CreatePostDto) {
        return this.postsService.create(
            body.title,
            body.content,
            req.user.sub,
            body.authorName
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
