import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { PagesService } from './pages.service';
import { Page } from './page.entity';
import { Repository } from 'typeorm';
import { CreatePageDto } from './dto/create-page.dto';


describe('Pages Service', () => {

  let service: PagesService;
  let repository: Repository<Page>;

  const mockPage: CreatePageDto = {
    'title': 'Page 1',
    'permalink': 'page-1',
    'content': 'Test content for page 1.',
    'isPublished': true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagesService,
        {
          provide: getRepositoryToken(Page),
          useFactory: () => ({
            find: jest.fn(() => true),
            findOne: jest.fn(() => true),
            create: jest.fn(() => true),
            save: jest.fn(() => true),
            delete: jest.fn(() => true),
            update: jest.fn(() => true),
          }),
        }
      ],
    }).compile();

    service = module.get<PagesService>(PagesService);
    repository = module.get<Repository<Page>>(getRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all pages', async () => {
    await service.findAll();
    expect(repository.find).toHaveBeenCalledWith();
  });

  it('should return one page', async () => {
    await service.findOne('test-id');
    expect(repository.findOne).toHaveBeenCalledWith('test-id');
  });

  it('should create a page', async () => {
    await service.create(mockPage);
    expect(repository.save).toHaveBeenCalledWith(Object.assign(new Page(), mockPage));
  });

  it('should delete a page', async () => {
    await service.delete('test-id');
    expect(repository.delete).toHaveBeenCalledWith('test-id');
  });
  
  it('should update a page', async () => {
    await service.update('test-id', mockPage);
    expect(repository.update).toHaveBeenCalledWith('test-id', mockPage);
  });
});
