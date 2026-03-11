import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from './item.entity';

describe('ItemsService', () => {
  let service: ItemsService;
  let repo: Repository<Item>;

  const mockItem: Item = { id: 1, name: 'Test', description: 'Desc' };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockItem),
    save: jest.fn().mockResolvedValue(mockItem),
    find: jest.fn().mockResolvedValue([mockItem]),
    findOneBy: jest.fn().mockResolvedValue(mockItem),
    remove: jest.fn().mockResolvedValue(mockItem),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: getRepositoryToken(Item), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    repo = module.get<Repository<Item>>(getRepositoryToken(Item));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create an item', async () => {
    const dto = { name: 'Test', description: 'Desc' };
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(mockItem);
  });

  it('should return all items', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockItem]);
  });

  it('should return one item', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockItem);
  });

  it('should throw NotFoundException', async () => {
    mockRepository.findOneBy.mockResolvedValueOnce(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update an item', async () => {
    const updated = { ...mockItem, name: 'Updated' };
    mockRepository.save.mockResolvedValueOnce(updated);
    const result = await service.update(1, { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('should remove an item', async () => {
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockItem);
  });
});
