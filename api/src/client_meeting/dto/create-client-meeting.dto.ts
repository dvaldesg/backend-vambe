import { IsBoolean, IsNotEmpty, IsString, Matches } from "class-validator";

export class ClientMeetingDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    salesmanName: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})$/, {
        message: 'Date must be in DD-MM-YYYY or YYYY-MM-DD format'
    })
    date: string;

    @IsBoolean()
    @IsNotEmpty()
    closed: boolean;

    @IsString()
    @IsNotEmpty()
    transcription: string;
}