import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {VehicleEntity} from "./vehicle.entity";

@Entity({
    database: 'fleetpro',
    name: 'technical_data',
})

export class TechnicalDataEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    engineCapacity: string; // Pojemność silnika

    @Column()
    enginePower: string; // Moc silnika

    @Column()
    fuel: string; // Paliwo

    @Column()
    alternativeFuel: string; // Paliwo alternatywne

    @Column()
    CO2Emission: string; // Emisja CO₂

    @Column()
    avgFuelConsumption: string; // Średnie zużycie paliwa na 100km

    @Column()
    totalSeats: string; // Liczba miejsc ogółem

    @Column()
    seatedSeats: string; // Liczba miejsc siedzących

    @Column()
    vehicleWeight: string; // Masa własna pojazdu

    @Column()
    maxTrailerWeightWithBrakes: string; // Maks. masa całkowita ciągniętej przyczepy z hamulcem

    @Column()
    maxTrailerWeightWithoutBrakes: string; // Maks. masa całkowita ciągniętej przyczepy bez hamulca

    @Column()
    payload: string; // Dopuszczalna ładowność

    @Column()
    grossWeight: string; // Dopuszczalna masa całkowita

    @Column()
    numberOfAxles: string; // Liczba osi

    @Column()
    axleSpacing: string; // Rozstaw osi

    @Column()
    wheelSpacing: string; // Rozstaw kół (średni)

    @Column()
    maxAxleLoad: string; // Maksymalny nacisk na oś

    @Column({default: ''})
    vehicleWidth: string;  //szerokosc

    @Column({default: ''})
    vehicleLenght: string; //dlugosc

    @Column({default: ''})
    vehicleHeight: string; //wysokosc

    @Column({default: ''})
    cargoBedWidth: string;

    @Column({default: ''})
    cargoBedLenght: string;

    @Column({default: ''})
    cargoBedHeight: string;


    @ManyToOne((type) => VehicleEntity, (entity) => entity.technicalData)
    vehicleProfile: VehicleEntity;
}