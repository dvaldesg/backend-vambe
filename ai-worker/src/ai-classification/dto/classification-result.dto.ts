import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CommercialSector, LeadSource, InterestReason, VambeModel } from '../enum';

export class ClassificationResultDto {
  @IsEnum(CommercialSector)
  @IsNotEmpty()
  commercialSector: CommercialSector;

  @IsEnum(LeadSource)
  @IsNotEmpty()
  leadSource: LeadSource;

  @IsEnum(InterestReason)
  @IsNotEmpty()
  interestReason: InterestReason;

  @IsBoolean()
  @IsNotEmpty()
  hasDemandPeaks: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hasSeasonalDemand: boolean;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  estimatedDailyInteractions: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  estimatedWeeklyInteractions: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  estimatedMonthlyInteractions: number;

  @IsBoolean()
  @IsNotEmpty()
  hasTechTeam: boolean;

  @IsEnum(VambeModel)
  @IsOptional()
  vambeModel?: VambeModel | null;

  @IsBoolean()
  @IsNotEmpty()
  isPotentialClient: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isProblemClient: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isLostClient: boolean;

  @IsBoolean()
  @IsNotEmpty()
  shouldBeContacted: boolean;

  @IsNumber()
  @IsNotEmpty()
  confidenceScore: number;

  @IsString()
  @IsNotEmpty()
  modelVersion: string;
}
