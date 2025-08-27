import { Module } from "@nestjs/common";
import { UpscalingController } from "./upscaling.controller";
import { UpscalingService } from "./upscaling.service";

@Module({
  controllers: [UpscalingController],
  providers: [UpscalingService],
})
export class UpscalingModule {}
