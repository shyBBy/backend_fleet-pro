import {IsOptional } from 'class-validator';

export class VehicleUpdateDto {
  @IsOptional()
  vehicleType: string;

  @IsOptional()
  name: string;

  @IsOptional()
  model: string;

  @IsOptional()
  registerNumber: string;

  @IsOptional()
  isCurrentVehicleInspection: boolean;

  @IsOptional()
  lastDateOfVehicleInspection: Date;

  @IsOptional()
  nextDateOfVehicleInspection: Date;

  @IsOptional()
  vehicleMileage: number;

  @IsOptional()
  photo: string;

  @IsOptional()
  vinNumber: string;

  @IsOptional()
  yearOfProduction: string;

  @IsOptional()
  firstRegistrationDate: string;

  @IsOptional()
  policyNumber: string;
}