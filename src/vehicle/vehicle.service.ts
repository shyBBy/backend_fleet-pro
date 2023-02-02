import { Injectable } from '@nestjs/common';danych
import {createResponse} from '../utils/createResponse'

@Injectable()
export class VehicleService {
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}
  

async create(vehicleCreateDto: VehicleCreateDto) {
  
  const {vehicleType, name, model, registerNumber, isCurrentVehicleInspection, nextDateOfVehicleInspection, lastDateOfVehicleInspection, vehicleMileage, photo, vinNumber, yearOfProduction, firstRegistrationDate, policyNumber } = vehicleCreateDto
  
  const isVehicleExist = await VehicleEntity.findOneBy({vinNumber})
  
  if (isVehicleExist) {
    throw new HttpException(
        {
          message: `Pojazd już istnieje w bazie danych, nie możesz go dodać drugi raz.`,
          isSuccess: false,
        },
        HttpStatus.BAD_REQUEST,
      );
  }
  
  const vehicle = new VehicleEntity();
  vehicle.vehicleType = vehicleType
  vehicle.name = name
  vehicle.model = model
  vehicle.registerNumber = registerNumber
  vehicle.isCurrentVehicleInspection = isCurrentVehicleInspection
  vehicle.nextDateOfVehicleInspection = nextDateOfVehicleInspection
  vehicle.lastDateOfVehicleInspection = lastDateOfVehicleInspection
  vehicle.vehicleMileage = vehicleMileage
  vehicle.photo = photo
  vehicle.vinNumber = vinNumber
  vehicle.yearOfProduction = yearOfProduction
  vehicle.firstRegistrationDate = firstRegistrationDate
  vehicle.policyNumber = policyNumber
  
  await vehicle.save()
  return createResponse(true, 'Pomyślnie dodano pojazd do bazy danych', 200);
  
  
  
  
}
  
  
  
  
  
}