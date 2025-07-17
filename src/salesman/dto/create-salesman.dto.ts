import { IsNotEmpty, IsString } from "class-validator";


export class CreateSalesmanDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
