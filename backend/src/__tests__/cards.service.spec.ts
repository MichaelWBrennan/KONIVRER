import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from '../cards/cards.service';
import { Card } from '../cards/entities/card.entity';
import { CreateCardDto } from '../cards/dto/card.dto';

describe('CardsService', () => {
  let service: CardsService;
  let repository: Repository<Card>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    })),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    repository = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Test Card',
        type: 'Creature' as any,
        element: 'Fire' as any,
        rarity: 'Common' as any,
        cost: 3,
        power: 2,
        toughness: 2,
        description: 'A test card',
      };

      const savedCard = { id: 'uuid-1', ...createCardDto, createdAt: new Date(), updatedAt: new Date() };
      
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedCard);
      mockRepository.save.mockResolvedValue(savedCard);

      const result = await service.create(createCardDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { name: createCardDto.name } });
      expect(repository.create).toHaveBeenCalledWith(createCardDto);
      expect(repository.save).toHaveBeenCalledWith(savedCard);
      expect(result).toEqual(savedCard);
    });

    it('should throw error if card name already exists', async () => {
      const createCardDto: CreateCardDto = {
        name: 'Existing Card',
        type: 'Creature' as any,
        element: 'Fire' as any,
        rarity: 'Common' as any,
        cost: 3,
        description: 'A test card',
      };

      mockRepository.findOne.mockResolvedValue({ id: 'existing-uuid', name: 'Existing Card' });

      await expect(service.create(createCardDto)).rejects.toThrow('Card with name "Existing Card" already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated cards', async () => {
      const mockCards = [
        { id: 'uuid-1', name: 'Card 1' },
        { id: 'uuid-2', name: 'Card 2' }
      ];
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockCards, 2]);

      const result = await service.findAll({});

      expect(result).toEqual({
        items: mockCards,
        total: 2,
        page: 1,
        limit: 20,
        pages: 1
      });
    });

    it('should apply search filters', async () => {
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll({
        search: 'test',
        type: 'Creature' as any,
        element: 'Fire' as any,
        rarity: 'Rare' as any,
        minCost: 1,
        maxCost: 5,
        legalOnly: true
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(card.name) LIKE LOWER(:search)'),
        { search: '%test%' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.type = :type', { type: 'Creature' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.element = :element', { element: 'Fire' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.rarity = :rarity', { rarity: 'Rare' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.cost >= :minCost', { minCost: 1 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.cost <= :maxCost', { maxCost: 5 });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('card.isLegal = :isLegal', { isLegal: true });
    });
  });

  describe('findOne', () => {
    it('should return a card by ID', async () => {
      const mockCard = { id: 'uuid-1', name: 'Test Card' };
      mockRepository.findOne.mockResolvedValue(mockCard);

      const result = await service.findOne('uuid-1');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
      expect(result).toEqual(mockCard);
    });

    it('should throw error if card not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow('Card with ID "non-existent" not found');
    });
  });

  describe('getStatistics', () => {
    it('should return card statistics', async () => {
      mockRepository.count.mockResolvedValue(100);
      
      const mockStats = [
        [{ type: 'Creature', count: '50' }],
        [{ element: 'Fire', count: '25' }],
        [{ rarity: 'Common', count: '40' }],
        [{ cost: '3', count: '15' }]
      ];
      
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getRawMany
        .mockResolvedValueOnce(mockStats[0])
        .mockResolvedValueOnce(mockStats[1])
        .mockResolvedValueOnce(mockStats[2])
        .mockResolvedValueOnce(mockStats[3]);

      const result = await service.getStatistics();

      expect(result.totalCards).toBe(100);
      expect(result.typeDistribution).toEqual(mockStats[0]);
      expect(result.elementDistribution).toEqual(mockStats[1]);
      expect(result.rarityDistribution).toEqual(mockStats[2]);
      expect(result.costDistribution).toEqual(mockStats[3]);
    });
  });
});