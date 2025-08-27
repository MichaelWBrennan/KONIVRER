import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { CardsService } from "../cards.service";
import { Card } from "../entities/card.entity";
import { CreateCardDto, UpdateCardDto, CardFilterDto } from "../dto/card.dto";

@Resolver(() => Card)
export class CardsResolver {
  constructor(private cardsService: CardsService) {}

  @Query(() => [Card], { name: "cards" })
  async getCards(@Args("filter", { nullable: true }) filter?: CardFilterDto) {
    const result = await this.cardsService.findAll(filter);
    return result.items;
  }

  @Query(() => Card, { name: "card" })
  async getCard(@Args("id", { type: () => ID }) id: string) {
    return this.cardsService.findOne(id);
  }

  @Query(() => Card, { name: "cardByName" })
  async getCardByName(@Args("name") name: string) {
    return this.cardsService.findByName(name);
  }

  @Mutation(() => Card)
  async createCard(@Args("input") createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Mutation(() => Card)
  async updateCard(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") updateCardDto: UpdateCardDto
  ) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Mutation(() => Boolean)
  async deleteCard(@Args("id", { type: () => ID }) id: string) {
    await this.cardsService.remove(id);
    return true;
  }
}
