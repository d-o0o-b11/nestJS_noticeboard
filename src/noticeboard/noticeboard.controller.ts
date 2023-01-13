import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';
import { NoticeBoardDTO, UpdateNoticeBoardDTO } from './noticeboard.dto';
import { NoticeboardService } from './noticeboard.service';

@Controller('noticeboard')
export class NoticeboardController {
  constructor(private readonly NoticeboardService: NoticeboardService) {}

  // @Get()
  // findAll(): string {
  //   return 'This action returns all noticeboard';
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): string {
  //   return `Thsi action returns one noticeboard ${id}`;
  // }

  @Post('test')
  async create(@Body() NoticeBoardDTO: NoticeBoardDTO) {
    return 'This action adds a new noticeboard';
  }

  @Post()
  /**
   * 게시글 생성 요청입니다.
   */
  async createBoard(@Body() NoticeBoardDTO: NoticeBoardDTO) {
    // return await this.NoticeboardService.createBoard(
    //   NoticeBoardDTO.title,
    //   NoticeBoardDTO.content,
    // );
    return this.NoticeboardService.createNotice(NoticeBoardDTO);
  }

  @Get('find')
  /**
   * 게시글 출력 요청입니다.
   * 조건없이 모든 게시글 출력하기
   */
  async findBoard() {
    return this.NoticeboardService.findNotice();
  }

  @Get()
  async detailBoard(@Query('board', ParseIntPipe) id: number) {
    return this.NoticeboardService.detailNotice(id);
  }

  @Delete()
  /**
   * 게시글 삭제 요청입니다.
   */
  async deleteBoard(@Query('test', ParseIntPipe) id: number) {
    // console.log(id);
    // if (id < 0) {
    //   throw new HttpException();
    // }

    return this.NoticeboardService.deleteNotice(id);
  }

  @Patch()
  /**
   * 게시글 수정 요청입니다.
   */
  async updateBoard(@Query('id') id, @Body() body: UpdateNoticeBoardDTO) {
    /**
     * Restful 에서 리소스를 식별하는 변수는 QueryString, Param
     */

    // const id = body.id;

    return this.NoticeboardService.updateNotice(id, body);
  }
}
