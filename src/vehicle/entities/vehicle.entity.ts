import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  vehicleMileage: number;

  // @ManyToOne(
  //   type => CompanyBranchEntity,
  //   companyBranch => companyBranch.vehicles,
  // )
  // assignedToCompanyBranchId: string;
  //
  // @ManyToOne(
  //   type => DriverEntity,
  //   driver => driver.vehicles,
  // )
  // assignedToDriverId: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  vinNumber: string;

  @Column()
  yearOfProduction: string;

  @Column()
  firstRegistrationDate: string;

  @Column()
  policyNumber: string;
  
  @Column()
  editedByUserId: string;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updateDate: Date;
}
