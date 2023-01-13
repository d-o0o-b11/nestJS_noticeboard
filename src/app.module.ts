import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticeboardModule } from './noticeboard/noticeboard.module';
import { NoticeBoardEntity } from './domain/noticeboard';
import { CommentModule } from './comment/comment.module';
import { commentEntity } from './domain/comment';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres-container',
      port: 5432,
      username: 'boardtestUSER',
      password: '123456',
      database: 'test',
      entities: [NoticeBoardEntity, commentEntity],
      synchronize: true,
    }),
    NoticeboardModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
