import { Body, Controller,Delete,Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

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
        @Post()
        create(@Body() body: CreateCommentDto) {
            return this.commentService.create(
                body.postId,
                body.content,
                body.authorId,
                body.authorName
            );
        }
        @Patch(':id')
        edit(@Param('id', ParseIntPipe) id:number, @Body() body: UpdateCommentDto) {
            
            return this.commentService.edit(
                id,
                body.content
            )
        }
        @Delete(':id')
        remove(@Param('id', ParseIntPipe) id: number) {

            return this.commentService.remove(id)
        }
}
