import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";


export class AddTechnicalDataDto {
    @IsOptional()
    @IsNumber()
    engineCapacity: string;

    @IsOptional()
    @IsNumber()
    enginePower: string; // Moc silnika

    @IsOptional()
    @IsString()
    fuel: string; // Paliwo

    @IsOptional()
    @IsString()
    alternativeFuel: string; // Paliwo alternatywne

    @IsOptional()
    @IsString()
    CO2Emission: string; // Emisja CO₂

    @IsOptional()
    @IsString()
    avgFuelConsumption: string; // Średnie zużycie paliwa na 100km

    @IsOptional()
    @IsNumber()
    totalSeats: string; // Liczba miejsc ogółem

    @IsOptional()
    @IsNumber()
    seatedSeats: string; // Liczba miejsc siedzących

    @IsOptional()
    @IsNumber()
    vehicleWeight: string; // Masa własna pojazdu

    @IsOptional()
    @IsNumber()
    maxTrailerWeightWithBrakes: string; // Maks. masa całkowita ciągniętej przyczepy z hamulcem

    @IsOptional()
    @IsNumber()
    maxTrailerWeightWithoutBrakes: string; // Maks. masa całkowita ciągniętej przyczepy bez hamulca

    @IsOptional()
    @IsNumber()
    payload: string; // Dopuszczalna ładowność

    @IsOptional()
    @IsNumber()
    grossWeight: string; // Dopuszczalna masa całkowita

    @IsOptional()
    @IsNumber()
    numberOfAxles: string; // Liczba osi

    @IsOptional()
    @IsNumber()
    axleSpacing: string; // Rozstaw osi

    @IsOptional()
    @IsNumber()
    wheelSpacing: string; // Rozstaw kół (średni)

    @IsOptional()
    @IsNumber()
    maxAxleLoad: string; // Maksymalny nacisk na oś


}