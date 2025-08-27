import { Module } from "@nestjs/common";
import { KonivrRulesSearchService } from "./konivr-rules-search.service";

@Module({
  providers: [KonivrRulesSearchService],
  exports: [KonivrRulesSearchService],
})
export class SearchModule {}
