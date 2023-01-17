import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';
import { CreateNoticeDto } from './dtos/create-notice.dto';
import { UpdateBoardDTO } from './dtos/update-notice.dto';
import { NoticeboardService } from './noticeboard.service';

@Controller('noticeboard')
export class NoticeboardController {
  constructor(
    @Inject('test')
    private readonly NoticeboardService: NoticeboardService,
  ) {}

  // @Get()
  // findAll(): string {
  //   return 'This action returns all noticeboard';
  // }

  // @Get(':id')
  // findOne(@Param('id') id: number): string {
  //   return `Thsi action returns one noticeboard ${id}`;
  // }

  @Post('test')
  async create(@Body() NoticeBoardDTO: CreateNoticeDto) {
    return 'This action adds a new noticeboard';
  }

  @Post()
  /**
   * 게시글 생성 요청입니다.
   */
  async createBoard(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    NoticeBoardDTO: CreateNoticeDto,
  ) {
    // return await this.NoticeboardService.createBoard(
    //   NoticeBoardDTO.title,
    //   NoticeBoardDTO.content,
    // );
    console.log(NoticeBoardDTO);
    return this.NoticeboardService.createNotice(NoticeBoardDTO as any);
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
    console.log(id);
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
  async updateBoard(
    @Query('id') id,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    body: UpdateBoardDTO,
  ) {
    /**
     * Restful 에서 리소스를 식별하는 변수는 QueryString, Param
     */

    // const id = body.id;

    return this.NoticeboardService.updateNotice(id, body);
  }
}
