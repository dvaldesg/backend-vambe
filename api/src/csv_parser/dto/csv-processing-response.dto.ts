import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CsvProcessingResponseDto {
    @IsString()
    message: string;

    @IsNumber()
    totalRows: number;

    @IsNumber()
    validRows: number;

    @IsArray()
    @IsString({ each: true })
    errors: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    createdSalesmen: any[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    createdMeetings: any[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Object)
    alreadyCreatedMeetings: any[];
}
