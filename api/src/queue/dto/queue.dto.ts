import { IsNumber, IsNotEmpty } from 'class-validator';

export class QueueDto {
    @IsNumber()
    @IsNotEmpty()
    meetingId: number;
}