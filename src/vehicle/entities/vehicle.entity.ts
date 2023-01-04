import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


  @Entity({
    database: 'app',
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

  @Column()
  isCurrentVehicleInspection: boolean;

  @Column()
  lastDateOfVehicleInspection: Date;

  @Column()
  nextDateOfVehicleInspection: Date;

  @Column()
  vehicleMileage: number;

  @ManyToOne(
    type => CompanyBranchEntity,
    companyBranch => companyBranch.vehicles,
  )
  assignedToCompanyBranchId: string;

  @ManyToOne(
    type => DriverEntity,
    driver => driver.vehicles,
  )
  assignedToDriverId: string;

  @Column({ nullable: true })
  photo?: string;

  @Column()
  vinNumber: string;

  @Column()
  yearOfProduction: string;

  @Column()
  firstRegistrationDate: string;

  @Column()
  policyNumber: string;
}