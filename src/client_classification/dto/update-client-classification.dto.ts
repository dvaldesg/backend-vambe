import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CommercialSector, LeadSource, InterestReason, VambeModel } from '../enum';

export class UpdateClientClassificationDto {
    @IsEnum(CommercialSector)
    @IsOptional()
    commercialSector?: CommercialSector;

    @IsEnum(LeadSource)
    @IsOptional()
    leadSource?: LeadSource;

    @IsEnum(InterestReason)
    @IsOptional()
    interestReason?: InterestReason;

    @IsBoolean()
    @IsOptional()
    hasDemandPeaks?: boolean;

    @IsBoolean()
    @IsOptional()
    hasSeasonalDemand?: boolean;

    @IsInt()
    @Min(0)
    @IsOptional()
    estimatedDailyInteractions?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    estimatedWeeklyInteractions?: number;

    @IsInt()
    @Min(0)
    @IsOptional()
    estimatedMonthlyInteractions?: number;

    @IsBoolean()
    @IsOptional()
    hasTechTeam?: boolean;

    @IsEnum(VambeModel)
    @IsOptional()
    vambeModel?: VambeModel;

    @IsBoolean()
    @IsOptional()
    isPotentialClient?: boolean;

    @IsBoolean()
    @IsOptional()
    isProblemClient?: boolean;

    @IsBoolean()
    @IsOptional()
    isLostClient?: boolean;

    @IsBoolean()
    @IsOptional()
    shouldBeContacted?: boolean;

    @IsNumber()
    @IsOptional()
    confidenceScore?: number;

    @IsString()
    @IsOptional()
    modelVersion?: string;
}
