import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNoticeRes } from './swaggerdtos/create-notice-res.dto';
import { CreateNoticeDto } from './dtos/create-notice.dto';
import { UpdateBoardDTO } from './dtos/update-notice.dto';
import { NoticeboardService } from './noticeboard.service';
import { GetNoticeRes } from './swaggerdtos/getnoticeres.dto';

@Controller('noticeboard')
@ApiTags('noticeboard API')
export class NoticeboardController {
  constructor(
    private readonly NoticeboardService: NoticeboardService, // private readonly WeatherService: WeatherService,
  ) {}

  @Post('test')
  async create(@Body() NoticeBoardDTO: CreateNoticeDto) {
    return 'This action adds a new noticeboard';
  }

  @ApiOperation({
    summary: '게시글 생성 요청',
  })
  @ApiBody({
    type: CreateNoticeDto,
  })
  @ApiResponse({
    status: 200,
    description: '게시글 생성 성공',
    type: CreateNoticeRes,
  })
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
    return this.NoticeboardService.createNotice(NoticeBoardDTO as any);
  }

  @ApiOperation({
    summary: '모든 게시글 출력 요청',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 출력 성공',
    type: GetNoticeRes,
  })
  @Get('find')
  /**
   * 게시글 출력 요청입니다.
   * 조건없이 모든 게시글 출력하기
   */
  async findBoard() {
    return this.NoticeboardService.findNotice();
  }

  @ApiOperation({
    summary: '개별 게시글 출력 요청',
  })
  @ApiResponse({
    status: 200,
    description: '게시글 출력 성공',
    type: GetNoticeRes,
  })
  @Get()
  async detailBoard(@Query('board', ParseIntPipe) id: number) {
    console.log(id);
    return this.NoticeboardService.detailNotice(id);
  }

  @ApiOperation({
    summary: '게시글 삭제 요청',
  })
  @ApiParam({
    // type: DeleteNoticeRes,
    name: 'id',
    description: '삭제할 게시글 번호',
    example: 1,
  })
  @Delete()
  /**
   * 게시글 삭제 요청입니다.
   */
  async deleteBoard(@Query('test', ParseIntPipe) id: number) {
    return this.NoticeboardService.deleteNotice(id);
  }

  @ApiOperation({
    summary: '게시글 수정 요청',
  })
  @ApiQuery({
    // type: DeleteNoticeRes,
    name: 'id',
    description: '수정할 게시글 번호',
    example: 1,
  })
  @ApiBody({
    type: UpdateBoardDTO,
  })
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
