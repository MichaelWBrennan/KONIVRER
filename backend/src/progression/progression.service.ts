import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TournamentProfile } from "./entities/tournament-profile.entity";
import { PointHistory } from "./entities/point-history.entity";
import {
  PointUpdateDto,
  TournamentProfileResponseDto,
  UpdateTournamentPreferencesDto,
} from "./dto/progression.dto";

@Injectable()
export class ProgressionService {
  constructor(
    @InjectRepository(TournamentProfile)
    private readonly profileRepo: Repository<TournamentProfile>,
    @InjectRepository(PointHistory)
    private readonly historyRepo: Repository<PointHistory>
  ) {}

  async getOrCreateProfile(userId: string): Promise<TournamentProfile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profileRepo.create({ userId });
      profile = await this.profileRepo.save(profile);
    }
    return profile;
  }

  async getProfile(userId: string): Promise<TournamentProfileResponseDto> {
    const profile = await this.getOrCreateProfile(userId);
    return this.toDto(profile);
  }

  async updatePreferences(
    dto: UpdateTournamentPreferencesDto
  ): Promise<TournamentProfileResponseDto> {
    const profile = await this.getOrCreateProfile(dto.userId);
    profile.preferences = {
      ...(profile.preferences || {}),
      ...dto.preferences,
    };
    profile.lastPointUpdate = new Date();
    const saved = await this.profileRepo.save(profile);
    return this.toDto(saved);
  }

  async applyPointUpdate(
    dto: PointUpdateDto
  ): Promise<TournamentProfileResponseDto> {
    const profile = await this.getOrCreateProfile(dto.userId);

    if (dto.pointType === "regional") {
      profile.regionalPoints += dto.points;
    } else if (dto.pointType === "global") {
      profile.globalPoints += dto.points;
    } else if (dto.pointType === "format") {
      const key = dto.formatKey || "default";
      const map = profile.formatSpecificPoints || {};
      map[key] = (map[key] || 0) + dto.points;
      profile.formatSpecificPoints = map;
    }

    profile.currentPoints = profile.regionalPoints + profile.globalPoints;
    profile.lastPointUpdate = new Date();
    const saved = await this.profileRepo.save(profile);

    const history = this.historyRepo.create({
      userId: dto.userId,
      eventId: dto.eventId,
      pointsEarned: dto.points,
      pointType: dto.pointType,
      eventDate: new Date(),
    });
    await this.historyRepo.save(history);

    return this.toDto(saved);
  }

  async getHistory(userId: string): Promise<PointHistory[]> {
    return this.historyRepo.find({
      where: { userId },
      order: { eventDate: "DESC" },
    });
  }

  async hasEventAwards(eventId: string): Promise<boolean> {
    const count = await this.historyRepo.count({ where: { eventId } });
    return count > 0;
  }

  private toDto(profile: TournamentProfile): TournamentProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      currentPoints: profile.currentPoints,
      regionalPoints: profile.regionalPoints,
      globalPoints: profile.globalPoints,
      formatSpecificPoints: profile.formatSpecificPoints,
      qualificationStatus: profile.qualificationStatus,
      lastPointUpdate: profile.lastPointUpdate,
      preferences: profile.preferences,
    };
  }

  // Placeholder for point decay background job
  async decayExpiredPoints(now: Date = new Date()): Promise<number> {
    const histories = await this.historyRepo.find();
    // This is a placeholder: in a real job, filter by decayDate <= now and subtract from profile
    return histories.length;
  }
}
