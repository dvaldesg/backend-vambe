import { IsBoolean, IsOptional } from 'class-validator';

export class CsvValidationResultDto<T> {
    @IsBoolean()
    isValid: boolean;

    @IsOptional()
    data?: T;

    @IsOptional()
    error?: string;
}
