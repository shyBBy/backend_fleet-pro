import {HttpException, HttpStatus,Injectable} from '@nestjs/common';
import {createResponse} from '../utils/createResponse'
import { DataSource, Like } from 'typeorm';
import {VehicleCreateDto} from "./dto/create-vehicle.dto";
import {VehicleEntity} from "./entities/vehicle.entity";
import {GetPaginatedListOfAllVehiclesResponse} from "../../types/vehicle";


@Injectable()
export class VehicleService {
  constructor(private dataSource: DataSource) {}

  async create(vehicleCreateDto: VehicleCreateDto) {
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
    searchType: string,
    searchValue: string,
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

      let searchValues = {}

      switch (true) {
        case !searchType && !searchValue:
          searchValues = {};
          break
        case searchType === 'registerNumber':
          searchValues = { registerNumber: Like(`%${searchValue}%`) };
          break
        case searchType === 'vinNumber':
          searchValues = { vinNumber: Like(`%${searchValue}%`) };
          break
        //@TODO: odkomentowac jak zrobi się system oddziałów
        // case searchType === 'placeName':
        //   searchValues = { placeName: Like(`%${searchValue}%`) };
        //   break
        default:
          searchValues = { name: Like(`%${searchValue}%`) };
      }

      try {
        const [vehicles, totalEntitiesCount] = await VehicleEntity.findAndCount(
          {
            where: { ...filteredValues, ...searchValues },
            skip: maxOnPage * (page - 1),
            take: maxOnPage,
          },
        );
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

  async removeOneById(id: string) {
    const vehicle = await VehicleEntity.findOneBy({ id });

    if (!vehicle) {
      throw new HttpException(
        {
          message: `Pojazd o podanym ID nie znajduje się w bazie danych - nie da się go usunąć.`,
          isSuccess: false,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await vehicle.remove();
      return createResponse(
        true,
        `Pomyślnie usunięto pojazd o nr rejestracyjnym: ${vehicle.registerNumber}`,
        200,
      );
    } catch (e) {
      console.log(e);
      throw new HttpException(
        {
          message: `Cos poszlo nie tak`,
          isSuccess: false,
        },
        HttpStatus.NOT_FOUND,
      );
    }
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
