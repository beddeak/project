import { Controller,Get, Param, Patch } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentService: CommentsService) {}
        @Get()
        findAll() {
            return this.commentService.findAll
        }
        @Get('post/:postId')
        findOne(@Param('postId') postId: string) {
            const commentsId = Number(postId)
            return this.commentService.findByPostId(commentsId);
        }
        
}
