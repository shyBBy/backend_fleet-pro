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
  
  
 public async getOneById(id: number): Promise<VehicleEntity | null> {
   return await VehicleEntity.findOneBy({id})
 }
  
 
 async getAllPaginatedVehs(
    page = 1,
    maxOnPage: number = 10,
    sort: string,
    order: 'ASC' | 'DESC',
    name: string,
    model: string,
    yearOfProduction: string,
    isCurrentVehicleInspection: boolean,
    vehicleType: string,
  ): Promise<GetPaginatedListOfAllVehsResponse> {
    const filterValues = {
      name,
      model,
      yearOfProduction,
      isCurrentVehicleInspection,
      vehicleType,
    };

    const filteredValues = {};
    Object.entries(filterValues)
      .filter((entry) => {
        if (entry[1] !== 0 && typeof entry[1] !== 'undefined' && !Number.isNaN(entry[1])) return true;
        return entry[1];
      })
      .forEach((e) => {
        return (filteredValues[e[0]] = e[1]);
      });

    if (typeof sort === 'undefined') {
      console.log(filteredValues);
      try {
        const [vehs, totalEntitiesCount] = await VehicleEntity.findAndCount({
          where: filteredValues,
          skip: maxOnPage * (page - 1),
          take: maxOnPage,
        });
        const pagesCount = Math.ceil(totalEntitiesCount / maxOnPage);
        if (!vehs.length) {
          return {
            vehs: [],
            pagesCount: 0,
            resultsCount: 0,
          };
        }
        return {
          vehs,
          pagesCount,
          resultsCount: totalEntitiesCount,
        };
      } catch (e) {
        console.log(e);
        throw new HttpException(
          {
            message: `Cos poszlo nie tak, spróbuj raz jeszcze.`,
            isSuccess: false,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
  
  
 async removeOneById(id: number) {
   const vehicle = await VehicleEntity.findOneBy({id})
   
   if (!vehicle) {
     throw new HttpException(
          {
            message: `Pojazd o podanym ID nie znajduje się w bazie danych - nie da się go usunąć.`,
            isSuccess: false,
          },
          HttpStatus.NOT_FOUND,
        );
   }
   
   try{
     
     await vehicle.remove()
     return createResponse(true, `Pomyślnie usunięto pojazd o nr rejestracyjnym: ${vehicle.registerNumber}`, 200);
     
   } catch(e) {
     console.log(e)
      throw new HttpException(
          {
            message: `Cos poszlo nie tak`,
            isSuccess: false,
          },
          HttpStatus.NOT_FOUND,
        );
   }
   
   
 }
}