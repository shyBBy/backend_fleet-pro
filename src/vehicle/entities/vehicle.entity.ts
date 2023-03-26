
import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TechnicalDataEntity} from "./technical-data.entity";

@Entity({
    database: 'fleetpro',
    name: 'vehicle',
})
export class VehicleEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    vehicleType: string;

    @Column()
    name: string;

    @Column()
    model: string;

    @Column()
    registerNumber: string;

    @Column({
        type: 'datetime',
        default: null,
    })
    lastDateOfVehicleInspection: Date;

    @Column({
        type: 'datetime',
        default: null,
    })
    nextDateOfVehicleInspection: Date;

    @Column({
        default: 0,
    })
    vehicleMileage: number;

    @Column({nullable: true})
    photo: string;

    @Column()
    vinNumber: string;

    @Column()
    yearOfProduction: string;

    @Column()
    firstRegistrationDate: string;

    @Column()
    policyNumber: string;

    @Column({
        default: '',
    })
    editedByUserId: string;

    @Column()
    placeName: string;

    @Column({
        default: '',
    })
    addedByUserId: string;


    @OneToMany(() => TechnicalDataEntity, (entity) => entity.vehicleProfile, {
        eager: true
    })
    technicalData: TechnicalDataEntity[];

}