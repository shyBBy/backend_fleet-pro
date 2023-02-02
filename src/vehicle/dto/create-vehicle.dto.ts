import { VehicleCreate } from '../../interfaces/vehicle';
import { IsEmail, IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class VehicleCreateDto {
  
  @IsNotEmpty()
  vehicleType: string;

  @IsNotEmpty()
  name: string;
  
  @IsNotEmpty()
  model: string;
  
  @IsNotEmpty()
  registerNumber: string;
   
  @IsNotEmpty()
  isCurrentVehicleInspection: boolean;
  
  @IsNotEmpty()
  lastDateOfVehicleInspection: Date;

  @IsNotEmpty()
  nextDateOfVehicleInspection: Date;

  @IsNotEmpty()
  vehicleMileage: number;
  
  @IsOptional()
  photo: string;

  @IsNotEmpty()
  vinNumber: string;

  @IsNotEmpty()
  yearOfProduction: string;

  @IsNotEmpty()
  firstRegistrationDate: string;

  @IsNotEmpty()
  policyNumber: string;
}