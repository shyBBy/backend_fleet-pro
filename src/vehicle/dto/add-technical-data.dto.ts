import {IsNumber, IsOptional, IsString} from "class-validator";


export class AddTechnicalDataDto {
    @IsOptional()
    @IsNumber()
    engineCapacity: number

    @IsOptional()
    @IsNumber()
    enginePower: number // Moc silnika

    @IsOptional()
    @IsString()
    fuel: string // Paliwo

    @IsOptional()
    @IsString()
    alternativeFuel: string // Paliwo alternatywne

    @IsOptional()
    @IsNumber()
    CO2Emission: number // Emisja CO₂

    @IsOptional()
    @IsNumber()
    avgFuelConsumption: number // Średnie zużycie paliwa na 100km

    @IsOptional()
    @IsNumber()
    totalSeats: number // Liczba miejsc ogółem

    @IsOptional()
    @IsNumber()
    seatedSeats: number // Liczba miejsc siedzących

    @IsOptional()
    @IsNumber()
    vehicleWeight: number // Masa własna pojazdu

    @IsOptional()
    @IsNumber()
    maxTrailerWeightWithBrakes: number // Maks. masa całkowita ciągniętej przyczepy z hamulcem

    @IsOptional()
    @IsNumber()
    maxTrailerWeightWithoutBrakes: number // Maks. masa całkowita ciągniętej przyczepy bez hamulca

    @IsOptional()
    @IsNumber()
    payload: number // Dopuszczalna ładowność

    @IsOptional()
    @IsNumber()
    grossWeight: number // Dopuszczalna masa całkowita

    @IsOptional()
    @IsNumber()
    numberOfAxles: number // Liczba osi

    @IsOptional()
    @IsNumber()
    axleSpacing: number // Rozstaw osi

    @IsOptional()
    @IsNumber()
    wheelSpacing: number // Rozstaw kół (średni)

    @IsOptional()
    @IsNumber()
    maxAxleLoad: number // Maksymalny nacisk na oś

    @IsOptional()
    @IsNumber()
    vehicleWidth: number  //szerokosc

    @IsOptional()
    @IsNumber()
    vehicleLenght: number //dlugosc

    @IsOptional()
    @IsNumber()
    vehicleHeight: number //wysokosc

    @IsOptional()
    @IsNumber()
    cargoBedWidth: number

    @IsOptional()
    @IsNumber()
    cargoBedLenght: number

    @IsOptional()
    @IsNumber()
    cargoBedHeight: number


}