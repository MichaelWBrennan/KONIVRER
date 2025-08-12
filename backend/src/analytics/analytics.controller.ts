import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsEventDto } from './dto/create-analytics-event.dto';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @ApiOperation({ summary: 'Track a new analytics event' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackEvent(@Body() createAnalyticsEventDto: CreateAnalyticsEventDto) {
    return this.analyticsService.trackEvent(createAnalyticsEventDto);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get analytics metrics' })
  @ApiResponse({ status: 200, description: 'Returns analytics metrics' })
  async getMetrics(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getMetrics(query);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ status: 200, description: 'Returns dashboard data' })
  async getDashboardData() {
    return this.analyticsService.getDashboardData();
  }

  @Get('anomalies')
  @ApiOperation({ summary: 'Get anomaly alerts' })
  @ApiResponse({ status: 200, description: 'Returns anomaly alerts' })
  async getAnomalies(@Query('limit') limit?: number) {
    return this.analyticsService.getAnomalies(limit);
  }

  @Patch('anomalies/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an anomaly alert' })
  @ApiResponse({ status: 200, description: 'Anomaly acknowledged' })
  async acknowledgeAnomaly(
    @Param('id') alertId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id || 'system';
    return this.analyticsService.acknowledgeAnomaly(alertId, userId);
  }
}