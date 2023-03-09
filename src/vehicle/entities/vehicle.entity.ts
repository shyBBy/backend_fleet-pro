import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  database: 'fleetpro',
  name: 'vehicle',
})
export class VehicleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
  })
  vehicleType: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  model: string;

  @Column({
    default: '',
  })
  registerNumber: string;

  @Column({
    default: null,
    name: 'isCurrentVehicleInspection',
  })
  isCurrentVehicleInspection: boolean;

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

  @Column({ nullable: true })
  photo: string;

  @Column({
    default: '',
  })
  vinNumber: string;

  @Column({
    default: '',
  })
  yearOfProduction: string;

  @Column({
    default: '',
  })
  firstRegistrationDate: string;

  @Column({
    default: '',
  })
  policyNumber: string;
  
  @Column({
    default: '',
  })
  editedByUserId: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updateDate: Date;
  
  @Column({
    default: '',
  })
  placeName: string;

  @Column({
    default: '',
  })
  addedByUserId: string;
}
