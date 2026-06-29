import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentsEntity]), AuthModule],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
