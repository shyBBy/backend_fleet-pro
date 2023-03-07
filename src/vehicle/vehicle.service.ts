import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {createResponse} from '../utils/createResponse'
import { DataSource, Like } from 'typeorm';
import {VehicleCreateDto} from "./dto/create-vehicle.dto";
import {VehicleEntity} from "./entities/vehicle.entity";
import {GetPaginatedListOfAllVehiclesResponse} from "../../types/vehicle";
import {VehicleUpdateDto} from "./dto/update-vehicle.dto";


@Injectable()
export class VehicleService {
  constructor(private dataSource: DataSource) {}

  async create(vehicleCreateDto: VehicleCreateDto, userId) {
    const {
      vehicleType,
      name,
      model,
      registerNumber,
      isCurrentVehicleInspection,
      nextDateOfVehicleInspection,
      lastDateOfVehicleInspection,
      vehicleMileage,
      photo,
      vinNumber,
      yearOfProduction,
      firstRegistrationDate,
      policyNumber,
      placeName,
    } = vehicleCreateDto;

    const isVehicleExist = await VehicleEntity.findOneBy({ vinNumber });

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
    vehicle.vehicleType = vehicleType;
    vehicle.name = name;
    vehicle.model = model;
    vehicle.registerNumber = registerNumber;
    vehicle.isCurrentVehicleInspection = isCurrentVehicleInspection;
    vehicle.nextDateOfVehicleInspection = nextDateOfVehicleInspection;
    vehicle.lastDateOfVehicleInspection = lastDateOfVehicleInspection;
    vehicle.vehicleMileage = vehicleMileage;
    vehicle.photo = photo;
    vehicle.vinNumber = vinNumber;
    vehicle.yearOfProduction = yearOfProduction;
    vehicle.firstRegistrationDate = firstRegistrationDate;
    vehicle.policyNumber = policyNumber;
    vehicle.placeName = placeName;
    vehicle.addedByUserId = userId;
    await vehicle.save();
    return createResponse(true, 'Pomyślnie dodano pojazd do bazy danych', 200);
  }

  public async getOneById(id: string): Promise<VehicleEntity | null> {
    return await VehicleEntity.findOneBy({ id });
  }

  async getAllPaginatedVehs(
    page = 1,
    sort: string,
    order: 'ASC' | 'DESC',
    name: string,
    model: string,
    yearOfProduction: string,
    isCurrentVehicleInspection: boolean,
    vehicleType: string,
    vehicleMileage: number,
    search: string,
  ): Promise<GetPaginatedListOfAllVehiclesResponse> {
    const filterValues = {
      name,
      model,
      yearOfProduction,
      isCurrentVehicleInspection,
      vehicleType,
      vehicleMileage,
    };
    
    const maxOnPage = 10;
    const filteredValues = {};
    Object.entries(filterValues)
      .filter((entry) => {
        if (entry[1] !== 0 && typeof entry[1] !== 'undefined' && !Number.isNaN(entry[1])
        )
          return true;
        return entry[1];
      })
      .forEach((e) => {
        return (filteredValues[e[0]] = e[1]);
      });
    if (typeof sort === 'undefined') {

      let searchOptions = [
            {name: Like(`%${search}%`)},
            {model: Like(`%${search}%`)},
            {registerNumber: Like(`%${search}%`)},
            {placeName: Like(`%${search}%`)},
            {vinNumber: Like(`%${search}%`)},
          ]

      try {
        const [vehicles, totalEntitiesCount] = await VehicleEntity.findAndCount({
          where: !search ? filteredValues : searchOptions,
          skip: maxOnPage * (page - 1),
          take: maxOnPage,
        })
        const pagesCount = Math.ceil(totalEntitiesCount / maxOnPage);
        if (!vehicles.length) {
          return {
            vehicles: [],
            pagesCount: 0,
            resultsCount: 0,
          };
        }
        return {
          vehicles,
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

  async removeOneById(id: string, userId) {
    console.log('w service')
    const result = await VehicleEntity.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    // const vehicle = await VehicleEntity.findOneBy({ id });
    // console.log('weszlismy')
    //
    // if (!vehicle) {
    //   throw new HttpException(
    //     {
    //       message: `Pojazd o podanym ID nie znajduje się w bazie danych - nie da się go usunąć.`,
    //       isSuccess: false,
    //     },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    //
    // try {
    //   await vehicle.remove()
    //   return createResponse(
    //     true,
    //     `Pomyślnie usunięto pojazd`,
    //     200,
    //   );
    // } catch (e) {
    //   console.log(e);
    //   throw new HttpException(
    //     {
    //       message: `Cos poszlo nie tak`,
    //       isSuccess: false,
    //     },
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
  }
  
  
  async updateVehicleData(vehicleUpdateDto: VehicleUpdateDto, userId: string, vehicleId: string) {
    
    // const updatedData = {
    //   ...vehicleUpdateDto,
    //   editedByUserId: userId,
    // }
    
    try {
      await VehicleEntity.update(vehicleId, {
        ...vehicleUpdateDto,
        editedByUserId: userId,
    })
    } catch(e) {
      console.log(e)
    }
    
   
    return createResponse(true, 'Pomyślnie zaaktualizowano dane pojazdu', 200);
    
  
    
  }

  // async addVehicleToPlace(addVehToPlace: AddVehToPlaceDto, user: UserEntity, vehicleId: string) {
  //
  //  const {placeId} = addVehToPlace
  //
  //  const place = await PlaceEntity.findOneBy({placeId})
  //  const vehicle = await VehicleEntity.findOneByOrFail({id: vehicleId})
  //
  //  if (!place || !vehicle) {
  //    throw new HttpException(
  //      {
  //        message: `W bazie danych nie ma takiego oddziału lub pojazdu.`,
  //        isSuccess: false,
  //      },
  //      HttpStatus.CONFLICT,
  //    );
  //  }
  //
  //
  //
  //  place.assignedVehicles = vehicle
  //  place.save()
  //  return createResponse(true, `Pomyslnie dodano pojazd o numerach rejestracyjnych:  ${vehicle.registerNumber} do oddziału: ${place.name}`, 200)
  //
  //
  // }
}
