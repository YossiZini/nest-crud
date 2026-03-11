import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  const mockItem = { id: 1, name: 'Test', description: 'Desc' };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockItem),
    findAll: jest.fn().mockResolvedValue([mockItem]),
    findOne: jest.fn().mockResolvedValue(mockItem),
    update: jest.fn().mockResolvedValue({ ...mockItem, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [{ provide: ItemsService, useValue: mockService }],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should create an item', async () => {
    const dto = { name: 'Test', description: 'Desc' };
    expect(await controller.create(dto)).toEqual(mockItem);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all items', async () => {
    expect(await controller.findAll()).toEqual([mockItem]);
  });

  it('should return one item', async () => {
    expect(await controller.findOne(1)).toEqual(mockItem);
  });

  it('should update an item', async () => {
    const result = await controller.update(1, { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should remove an item', async () => {
    await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
