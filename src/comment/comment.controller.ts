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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiPropertyOptional,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { GetCommentRes } from '../noticeboard/swaggerdtos/getcomment.dto';

@Controller('comment')
@ApiTags('comment API')
export class CommentController {
  constructor(private readonly CommentService: CommentService) {}

  @ApiOperation({
    summary: '댓글 생성 요청',
  })
  @ApiBody({
    type: CreateCommentDto,
  })
  @ApiParam({
    name: 'id',
    description: '댓글 작성할 게시글 번호',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '댓글 작성 성공',
    type: GetCommentRes,
  })
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

  @ApiOperation({
    summary: '댓글 삭제',
  })
  @ApiQuery({
    name: 'comment',
    description: '삭제할 댓글 번호',
    example: 1,
  })
  @Delete()
  async deleteComment(@Query('comment', ParseIntPipe) id: number) {
    return this.CommentService.deleteComment(id);
  }

  @ApiOperation({
    summary: '댓글 수정',
  })
  @ApiBody({
    type: UpdateCommentDto,
  })
  @ApiQuery({
    name: 'comment',
    description: '수정할 댓글 번호',
    example: 1,
  })
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
