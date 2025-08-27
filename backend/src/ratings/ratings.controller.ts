import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { RatingsService } from "./ratings.service";
import { UpdateRatingsDto, RatingResponseDto } from "./dto/ratings.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("ratings")
@Controller("api/ratings")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Get(":userId")
  @ApiOperation({ summary: "Get player rating metadata" })
  @ApiResponse({
    status: 200,
    description: "Player rating retrieved successfully",
    type: RatingResponseDto,
  })
  @ApiResponse({ status: 404, description: "Player rating not found" })
  async getPlayerRating(
    @Param("userId", ParseUUIDPipe) userId: string
  ): Promise<RatingResponseDto> {
    return this.ratingsService.getPlayerRating(userId);
  }

  @Post("update")
  @ApiOperation({ summary: "Update player ratings based on match results" })
  @ApiResponse({ status: 200, description: "Ratings updated successfully" })
  @ApiResponse({ status: 400, description: "Invalid match results" })
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.TOURNAMENT_ORGANIZER,
    UserRole.JUDGE_L1,
    UserRole.JUDGE_L2,
    UserRole.JUDGE_L3,
    UserRole.ADMIN
  )
  async updateRatings(@Body() updateDto: UpdateRatingsDto): Promise<any> {
    return this.ratingsService.updateRatings(updateDto);
  }
}
