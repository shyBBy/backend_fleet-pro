import {VehicleEntity} from "./vehicle.entity";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";



@Entity({
    database: 'fleetpro',
    name: 'vehicle_tech_information',
})

export class VehicleTechEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne((type) => VehicleEntity, (entity) => entity.techInformation)
    vehicleProfile: VehicleEntity;

    @Column({
        default: 0
    })
    engineCapacity: number;

    @Column()
    enginePower: number;

    @Column()
    fuelType: string;

    @Column()
    alternativeFuelType: string;

    @Column()
    co2Emission: string;

    @Column()
    averageFuelConsumption: number;

    // @Column({ nullable: true })
    // totalNumberOfSeats: number | string;

    // @Column({ nullable: true })
    // numberOfPassengerSeats: number | string;

    @Column()
    vehicleWeight: number;

    @Column()
    maximumPermissibleTrailerWeightWithBrakes: number;

    @Column()
    maximumPermissibleTrailerWeightWithoutBrakes: number;

    @Column()
    permissiblePayload: number;

    @Column()
    maximumPermissibleTotalWeight: number;

    // @Column({ nullable: true })
    // numberOfAxles: number | string;

    @Column()
    wheelbase: number;

    @Column()
    averageWheelbase: number;

    @Column()
    maximumAxisLoad: number;

    @Column()
    vehicleWidth: number;

    @Column()
    vehicleLength: number;

    @Column()
    vehicleHeight: string;

    @Column({default: 0})
    cargoBedWidth: number;

    @Column({default: 0})
    cargoBedLength: number;

    @Column({default: 0})
    cargoBedHeight: string;

}