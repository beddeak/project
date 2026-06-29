import { Body, Controller,Delete,Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/JwTAuth.guard';

type AuthenticatedRequest = Request & {
    user: {
        sub:number;
        email:string;
        role: 'user' | 'admin';
        name:string;
    }
}

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) {}
        @Get()
        findAll() {
            return this.commentService.findAll()
        }
        @Get('post/:postId')
        findByPostId(@Param('postId', ParseIntPipe) postId: number) {
            return this.commentService.findByPostId(postId);
        }
        @Get(':id')
        findOne(@Param('id', ParseIntPipe) id: number) {
            return this.commentService.findOne(id)
        }
        @UseGuards(JwtAuthGuard)
        @Post()
        create(@Req() req:AuthenticatedRequest,@Body() body: CreateCommentDto) {
            return this.commentService.create(
                body.postId,
                body.content,
                req.user.sub,
                req.user.name
            );
        }
        @UseGuards(JwtAuthGuard)
        @Patch(':id')
        edit(@Req() req: AuthenticatedRequest,@Param('id', ParseIntPipe) id:number, @Body() body: UpdateCommentDto) {
            
            return this.commentService.edit(
                id,
                body.content,
                req.user.sub,
                req.user.role
            )
        }
        @UseGuards(JwtAuthGuard)
        @Delete(':id')
        remove(@Req() req:AuthenticatedRequest,@Param('id', ParseIntPipe) id: number) {

            return this.commentService.remove(
                id,
                req.user.sub,
                req.user.role
            )
        }
}
