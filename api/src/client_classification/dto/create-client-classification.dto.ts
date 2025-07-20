import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { CommercialSector, LeadSource, InterestReason, VambeModel } from '../enum';

export class CreateClientClassificationDto {
    @IsInt()
    @IsNotEmpty()
    clientMeetingId: number;

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
