import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @Post(':id')
  async createComment(
    @Param('id', ParseIntPipe) noticeId: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    CreateCommentDto: CreateCommentDto,
  ) {
    return this.CommentService.createComment(noticeId, CreateCommentDto);
  }

  @Delete()
  async deleteComment(@Query('comment', ParseIntPipe) id: number) {
    return this.CommentService.deleteComment(id);
  }

  @Patch()
  async updateComment(
    @Query('comment', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    data: UpdateCommentDto,
  ) {
    return this.CommentService.updateComment(id, data);
  }
}
