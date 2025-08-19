import { Test, TestingModule } from '@nestjs/testing';
import { OcrController } from './ocr.controller';
import { OcrService } from './ocr.service';
import { CardsService } from '../cards/cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from '../cards/entities/card.entity';

describe('OcrController', () => {
  let controller: OcrController;
  let service: OcrService;

  const mockOcrService = {
    extractCardData: jest.fn(),
  };

  const mockCardsService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrController],
      providers: [
        {
          provide: OcrService,
          useValue: mockOcrService,
        },
        // OcrService depends on CardsService, so we need to provide a mock for it.
        // Even though we are mocking OcrService directly, the dependency needs to be resolved.
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
        // CardsService depends on the Card repository.
        {
          provide: getRepositoryToken(Card),
          useValue: {}, // empty mock for the repository
        }
      ],
    }).compile();

    controller = module.get<OcrController>(OcrController);
    service = module.get<OcrService>(OcrService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should call OcrService.extractCardData with the uploaded file', async () => {
      const file: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 12345,
        buffer: Buffer.from('test'),
        stream: null,
        destination: '',
        filename: '',
        path: ''
      };

      const expectedResult = { message: 'success' };
      mockOcrService.extractCardData.mockResolvedValue(expectedResult);

      const result = await controller.uploadFile(file);

      expect(service.extractCardData).toHaveBeenCalledWith(file);
      expect(result).toEqual(expectedResult);
    });
  });
});
