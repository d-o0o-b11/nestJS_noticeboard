import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { commentEntity } from 'src/domain/comment';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([commentEntity])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
