import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { threadId } from 'worker_threads';
import { commentDTO, UpdateCommentDTO } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @Post(':id')
  async createComment(
    @Param('id') noticeId: number,
    @Body() commentDTO: commentDTO,
  ) {
    return this.CommentService.createComment(noticeId, commentDTO);
  }

  @Delete()
  async deleteComment(@Query('comment') id: number) {
    return this.CommentService.deleteComment(id);
  }

  @Patch()
  async updateComment(
    @Query('comment') id: number,
    @Body() data: UpdateCommentDTO,
  ) {
    return this.CommentService.updateComment(id, data);
  }
}
