import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CsvProcessingResultDto<T> {
    @ValidateNested({ each: true })
    @Type(() => Object)
    data: T[];

    @IsArray()
    @IsString({ each: true })
    errors: string[];

    @IsNumber()
    totalRows: number;

    @IsNumber()
    validRows: number;
}
