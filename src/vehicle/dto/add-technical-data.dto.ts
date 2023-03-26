import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";


export class AddTechnicalDataDto {
    @IsOptional()
    @IsNumber()
    engineCapacity: number;

    @IsOptional()
    @IsNumber()
    enginePower: number;

    @IsOptional()
    @IsString()
    fuelType: string;

    @IsOptional()
    @IsString()
    alternativeFuelType: string;

    @IsOptional()
    @IsString()
    co2Emissions: string;

    @IsOptional()
    @IsString()
    averageFuelConsumption: number ;

    @IsOptional()
    @IsNumber()
    totalNumberOfSeats: number;

    @IsOptional()
    @IsNumber()
    numberOfPassengerSeats: number;

    @IsOptional()
    @IsNumber()
    vehicleWeight: number;

    @IsOptional()
    @IsNumber()
    maximumPermissibleTrailerWeightWithBrakes: number;

    @IsOptional()
    @IsNumber()
    maximumPermissibleTrailerWeightWithoutBrakes: number;

    @IsOptional()
    @IsNumber()
    permissiblePayload: number;

    @IsOptional()
    @IsNumber()
    maximumPermissibleTotalWeight: number;

    @IsOptional()
    @IsNumber()
    numberOfAxles: number;

    @IsOptional()
    @IsNumber()
    wheelbase: number;

    @IsOptional()
    @IsNumber()
    averageWheelbase: number;

    @IsOptional()
    @IsNumber()
    maximumAxisLoad: number;


    @IsOptional()
    @IsNumber()
    vehicleWidth: number;

    @IsOptional()
    @IsNumber()
    vehicleLength: number;

    @IsOptional()
    @IsString()
    vehicleHeight: string;

    @IsOptional()
    @IsNumber()
    cargoBedWidth: number;

    @IsOptional()
    @IsNumber()
    cargoBedLength: number;

    @IsOptional()
    @IsString()
    cargoBedHeight: string;

}