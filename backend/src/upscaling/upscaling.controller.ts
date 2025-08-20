import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UpscalingService } from './upscaling.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('images')
@Controller('api/images')
export class UpscalingController {
  constructor(private readonly upscalingService: UpscalingService) {}

  @Get('upscale')
  @ApiOperation({ summary: 'Upscale an image' })
  @ApiQuery({ name: 'imageUrl', required: true, description: 'URL of the image to upscale' })
  @ApiQuery({ name: 'level', required: false, description: 'Upscaling level (level1, level2, or level3)', enum: ['level1', 'level2', 'level3'] })
  @ApiResponse({ status: 200, description: 'Image upscaled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid image URL or upscaling failed' })
  async upscaleImage(
    @Query('imageUrl') imageUrl: string,
    @Query('level') level: 'level1' | 'level2' | 'level3' = 'level1',
    @Res() res: Response,
  ) {
    const imageBuffer = await this.upscalingService.upscaleImage(imageUrl, level);
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  }
}
