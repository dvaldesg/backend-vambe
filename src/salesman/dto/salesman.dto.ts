import { IsNotEmpty, IsString } from "class-validator";


export class SalesmanDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
