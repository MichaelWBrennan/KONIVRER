import { Module } from "@nestjs/common";
import { MigrationService } from "./migration.service";
import { MigrationController } from "./migration.controller";
import { CardsModule } from "../cards/cards.module";

@Module({
  imports: [CardsModule],
  providers: [MigrationService],
  controllers: [MigrationController],
  exports: [MigrationService],
})
export class MigrationModule {}
