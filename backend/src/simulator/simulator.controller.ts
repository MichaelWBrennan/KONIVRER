import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { SimulatorService } from "./simulator.service";
import {
  SimulationConfigDto,
  SimulationResponseDto,
} from "./dto/simulation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("simulator")
@Controller("api/sim")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post("run")
  @ApiOperation({ summary: "Run deck simulation" })
  @ApiResponse({
    status: 201,
    description: "Simulation started successfully",
    type: SimulationResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid simulation configuration" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async runSimulation(
    @Body() config: SimulationConfigDto,
    @Request() req
  ): Promise<SimulationResponseDto> {
    return this.simulatorService.runSimulation(config, req.user.id);
  }

  @Get(":simId")
  @ApiOperation({ summary: "Get simulation results" })
  @ApiResponse({
    status: 200,
    description: "Simulation results retrieved successfully",
    type: SimulationResponseDto,
  })
  @ApiResponse({ status: 404, description: "Simulation not found" })
  async getSimulation(
    @Param("simId", ParseUUIDPipe) simId: string,
    @Request() req
  ): Promise<SimulationResponseDto> {
    return this.simulatorService.getSimulation(simId, req.user.id);
  }
}
