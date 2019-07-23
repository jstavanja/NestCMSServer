import { Test, TestingModule } from '@nestjs/testing';

import { PagesController } from './pages.controller';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';

describe('Pages Controller', () => {

  let controller: PagesController;
  let service: PagesService;

  const mockPage: CreatePageDto = {
    title: 'Page 1',
    permalink: 'page-1',
    content: 'Test content for page 1.',
    isPublished: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagesController],
      providers: [
        {
          provide: PagesService,
          useFactory: () => ({
            findAll: jest.fn(() => true),
            findOne: jest.fn(() => true),
            create: jest.fn(() => true),
            delete: jest.fn(() => true),
            update: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    controller = module.get<PagesController>(PagesController);
    service = module.get<PagesService>(PagesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get pages', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get one page', async () => {
    await controller.findOne('test-id');
    expect(service.findOne).toHaveBeenCalledWith('test-id');
  });

  it('should create a page', async () => {
    await controller.create(mockPage);
    expect(service.create).toBeCalledWith(mockPage);
  });

  it('should delete a page', async () => {
    await controller.delete('test-id');
    expect(service.delete).toHaveBeenCalledWith('test-id');
  });

  it('should update a page', async () => {
    await controller.update('test-id', mockPage);
    expect(service.update).toHaveBeenCalledWith('test-id', mockPage);
  });
});
