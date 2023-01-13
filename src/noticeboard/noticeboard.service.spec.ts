import { Test, TestingModule } from '@nestjs/testing';
import { NoticeboardService } from './noticeboard.service';

describe('NoticeboardService', () => {
  let service: NoticeboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeboardService],
    }).compile();

    service = module.get<NoticeboardService>(NoticeboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
