import { Body, Controller,Delete,Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) {}
        @Get()
        findAll() {
            return this.commentService.findAll()
        }
        @Get('post/:postId')
        findByPostId(@Param('postId') postId: string) {
            const id = Number(postId)
            return this.commentService.findByPostId(id);
        }
        @Get(':id')
        findOne(@Param('id') id: string) {
            const commentid = Number(id)
            return this.commentService.findOne(commentid)
        }
        @Post()
        create(@Body() body: any) {
            return this.commentService.create(
                body.postId,
                body.content,
                body.authorId,
                body.authorName
            );
        }
        @Patch(':id')
        edit(@Param('id') id:string, @Body() body: any) {
            const commentId = Number(id)
            
            return this.commentService.edit(
                commentId,
                body.content
            )
        }
        @Delete(':id')
        remove(@Param('id') id: string) {
            const commentId = Number(id)

            return this.commentService.remove(commentId)
        }
}
