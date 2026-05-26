import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'database.sqlite',
    autoLoadEntities: true,
    synchronize: true,
  }),

  AuthModule,
  UsersModule,
  PostsModule,
  CommentsModule,
  AdminModule,
  ReportsModule,
  LikesModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}