import { Controller, Get, Post, Put, Param, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AiOpponentService } from './ai-opponent.service';

interface StartGameDto {
  aiOpponentId: string;
  playerDeck: {
    id: string;
    name: string;
    cards: string[];
  };
}

interface MakeMoveDto {
  type: 'play_card' | 'attack' | 'defend' | 'pass' | 'special';
  cardId?: string;
  target?: string;
  details?: any;
}

@ApiTags('AI Opponent')
@Controller('ai-opponent')
export class AiOpponentController {
  constructor(private readonly aiOpponentService: AiOpponentService) {}

  @Get('opponents')
  @ApiOperation({ summary: 'Get available AI opponents' })
  @ApiResponse({ status: 200, description: 'AI opponents retrieved successfully' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  async getAvailableOpponents(@Query('userId') userId: string) {
    try {
      const opponents = await this.aiOpponentService.getAvailableOpponents(userId);

      return {
        success: true,
        data: opponents,
        total: opponents.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get AI opponents',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('opponents/:id')
  @ApiOperation({ summary: 'Get AI opponent by ID' })
  @ApiResponse({ status: 200, description: 'AI opponent retrieved successfully' })
  @ApiParam({ name: 'id', description: 'AI Opponent ID' })
  async getOpponentById(@Param('id') id: string) {
    try {
      const opponent = await this.aiOpponentService.getOpponentById(id);

      if (!opponent) {
        throw new HttpException(
          {
            success: false,
            message: 'AI Opponent not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: opponent,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get AI opponent',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('opponents/:id/stats')
  @ApiOperation({ summary: 'Get AI opponent statistics' })
  @ApiResponse({ status: 200, description: 'AI opponent stats retrieved successfully' })
  @ApiParam({ name: 'id', description: 'AI Opponent ID' })
  async getOpponentStats(@Param('id') id: string) {
    try {
      const stats = await this.aiOpponentService.getOpponentStats(id);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get AI opponent stats',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('games')
  @ApiOperation({ summary: 'Start a new AI game' })
  @ApiResponse({ status: 201, description: 'AI game started successfully' })
  async startGame(@Body() startGameDto: StartGameDto) {
    try {
      const result = await this.aiOpponentService.startGame(
        startGameDto.aiOpponentId, // This should come from authenticated user
        startGameDto.aiOpponentId,
        startGameDto.playerDeck
      );

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            message: result.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        data: {
          gameId: result.gameId,
          gameState: result.gameState,
        },
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to start AI game',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('games/:gameId')
  @ApiOperation({ summary: 'Get AI game state' })
  @ApiResponse({ status: 200, description: 'Game state retrieved successfully' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  async getGameState(@Param('gameId') gameId: string) {
    try {
      const gameState = await this.aiOpponentService.getGameState(gameId);

      return {
        success: true,
        data: gameState,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get game state',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('games/:gameId/move')
  @ApiOperation({ summary: 'Make a move in AI game' })
  @ApiResponse({ status: 200, description: 'Move processed successfully' })
  @ApiParam({ name: 'gameId', description: 'Game ID' })
  async makeMove(
    @Param('gameId') gameId: string,
    @Body() makeMoveDto: MakeMoveDto
  ) {
    try {
      const result = await this.aiOpponentService.makeMove(gameId, makeMoveDto);

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            message: result.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        data: {
          newGameState: result.gameState,
          aiResponse: result.aiResponse,
        },
        message: result.message,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to process move',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('games')
  @ApiOperation({ summary: 'Get user AI games' })
  @ApiResponse({ status: 200, description: 'AI games retrieved successfully' })
  @ApiQuery({ name: 'userId', description: 'User ID', required: true })
  @ApiQuery({ name: 'limit', description: 'Number of games to return', required: false })
  async getUserGames(
    @Query('userId') userId: string,
    @Query('limit') limit?: number
  ) {
    try {
      const games = await this.aiOpponentService.getPlayerGames(userId, limit);

      return {
        success: true,
        data: games,
        total: games.length,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get user games',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default AI opponents' })
  @ApiResponse({ status: 201, description: 'Default AI opponents created successfully' })
  async seedDefaultOpponents() {
    try {
      await this.aiOpponentService.seedDefaultOpponents();

      return {
        success: true,
        message: 'Default AI opponents seeded successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to seed default opponents',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}