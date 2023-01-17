import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commentEntity } from 'src/domain/comment';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(commentEntity)
    private repository: Repository<commentEntity>,
  ) {}

  /**
   *
   * 댓글 작성 post
   */
  async createComment(noticeId: number, data: CreateCommentDto) {
    const entity: commentEntity = new commentEntity();
    entity.board_id = noticeId;
    entity.content = data.content;

    return this.repository.save(entity);
  }

  /**
   * 댓글 수정 patch
   */
  async updateComment(id: number, data: UpdateCommentDto) {
    return this.repository.update(id, data);
  }

  // /**
  //  * 댓글 출력 get >> noticeboard에서 실행
  //  */
  // async findComment(id: number) {
  //   return this.repository.find();
  // }

  /**
   * 댓글 삭제 delete
   */
  async deleteComment(id: number) {
    return this.repository.delete(id);
  }
}
