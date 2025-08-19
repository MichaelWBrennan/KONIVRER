import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('ocr')
@Controller('api/ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a card image for OCR processing' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Card data extracted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file upload' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.ocrService.extractCardData(file);
  }
}
