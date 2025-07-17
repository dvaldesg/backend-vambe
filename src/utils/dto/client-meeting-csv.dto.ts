import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientMeetingCsvDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
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
    date: string;

    @IsBoolean()
    closed: boolean;

    @IsString()
    @IsNotEmpty()
    transcription: string;
}
