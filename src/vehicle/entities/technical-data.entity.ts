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
    engineCapacity: number; // Pojemność silnika

    @Column()
    enginePower: number; // Moc silnika

    @Column()
    fuel: string; // Paliwo

    @Column()
    alternativeFuel: string; // Paliwo alternatywne

    @Column()
    CO2Emission: number; // Emisja CO₂

    @Column()
    avgFuelConsumption: number; // Średnie zużycie paliwa na 100km

    @Column()
    totalSeats: number; // Liczba miejsc ogółem

    @Column()
    seatedSeats: number; // Liczba miejsc siedzących

    @Column()
    vehicleWeight: number; // Masa własna pojazdu

    @Column()
    maxTrailerWeightWithBrakes: number; // Maks. masa całkowita ciągniętej przyczepy z hamulcem

    @Column()
    maxTrailerWeightWithoutBrakes: number; // Maks. masa całkowita ciągniętej przyczepy bez hamulca

    @Column()
    payload: number; // Dopuszczalna ładowność

    @Column()
    grossWeight: number; // Dopuszczalna masa całkowita

    @Column()
    numberOfAxles: number; // Liczba osi

    @Column()
    axleSpacing: number; // Rozstaw osi

    @Column()
    wheelSpacing: number; // Rozstaw kół (średni)

    @Column()
    maxAxleLoad: number; // Maksymalny nacisk na oś

    @Column({default: 0})
    vehicleWidth: number;  //szerokosc

    @Column({default: 0})
    vehicleLenght: number; //dlugosc

    @Column({default: 0})
    vehicleHeight: number; //wysokosc

    @Column({default: 0})
    cargoBedWidth: number;

    @Column({default: 0})
    cargoBedLenght: number;

    @Column({default: 0})
    cargoBedHeight: number;


    @ManyToOne((type) => VehicleEntity, (entity) => entity.technicalData)
    vehicleProfile: VehicleEntity;
}