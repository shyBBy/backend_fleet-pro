import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {createResponse} from '../utils/createResponse'
import {DataSource, Like} from 'typeorm';
import {VehicleCreateDto} from "./dto/create-vehicle.dto";
import {VehicleEntity} from "./entities/vehicle.entity";
import {GetPaginatedListOfAllVehiclesResponse, MulterDiskUploadedFiles} from "types";
import {VehicleUpdateDto} from "./dto/update-vehicle.dto";
import {AddTechnicalDataDto} from "./dto/add-technical-data.dto";
import {TechnicalDataEntity} from "./entities/technical-data.entity";
import {storageDir} from "../utils/storage";
import * as fs from "fs";
import * as path from "path";
import {UserEntity} from "../user/entities/user.entity";


@Injectable()
export class VehicleService {
    constructor(private dataSource: DataSource) {
    }

    async create(vehicleCreateDto: VehicleCreateDto, userId) {
        const {
            vehicleType,
            name,
            model,
            registerNumber,
            nextDateOfVehicleInspection,
            lastDateOfVehicleInspection,
            vehicleMileage,
            vinNumber,
            yearOfProduction,
            firstRegistrationDate,
            policyNumber,
            placeName,
        } = vehicleCreateDto;

        const isVehicleExist = await VehicleEntity.findOneBy({vinNumber});

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
        vehicle.nextDateOfVehicleInspection = nextDateOfVehicleInspection;
        vehicle.lastDateOfVehicleInspection = lastDateOfVehicleInspection;
        vehicle.vehicleMileage = vehicleMileage;
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
        return await VehicleEntity.findOneBy({id});
    }

    async getAllPaginatedVehs(
        page = 1,
        sort: string,
        order: 'ASC' | 'DESC',
        name: string,
        model: string,
        yearOfProduction: string,
        vehicleType: string,
        vehicleMileage: number,
        search: string,
    ): Promise<GetPaginatedListOfAllVehiclesResponse> {
        const filterValues = {
            name,
            model,
            yearOfProduction,
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
        const vehicle = await VehicleEntity.findOne({
            relations: ['technicalData'],
            where: {id},
        })

        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }

        // usuń wszystkie encje TechnicalDataEntity powiązane z daną encją VehicleEntity
        for (const technicalData of vehicle.technicalData) {
            await technicalData.remove();
        }

        // usuń encję VehicleEntity
        await vehicle.remove();


    }


    async uploadAvatar(id: string, files: MulterDiskUploadedFiles) {
        const avatar = files?.avatar?.[0] ?? null;

        console.log('w serwisie', {avatar})

        try {
            const vehicle = await VehicleEntity.findOneBy({id})

            if (!vehicle) {
                throw new BadRequestException('Pojazd nie istnieje');
            }

            if (avatar) {
                if (vehicle.avatar) {
                    const filePath = path.join(storageDir(), 'vehicle-avatars', vehicle.avatar);
                    if (fs.existsSync(filePath)) {
                        try {
                            fs.unlinkSync(filePath);
                        } catch (e) {
                            throw e
                        }
                    }
                }
                vehicle.avatar = avatar.filename
            }
            await vehicle.save()
        } catch (e) {
            try {
                if (avatar) {
                    fs.unlinkSync(
                        path.join(storageDir(), 'vehicle-avatars', avatar.filename)
                    );
                }
            } catch (e2) {
            }

            throw e;
        }
    }


    async updateVehicleData(vehicleUpdateDto: VehicleUpdateDto, userId: string, vehicleId: string) {


        try {

            await VehicleEntity.update(vehicleId, {
                ...vehicleUpdateDto,
                editedByUserId: userId,
            })
        } catch (e) {
            console.log(e)
        }


        return createResponse(true, 'Pomyślnie zaaktualizowano dane pojazdu', 200);


    }

    async getPhoto(id: string, res: any) {
        try {
            const vehicle = await VehicleEntity.findOneBy({id})
            if (!vehicle) {
                throw new NotFoundException(`Pojazd o podanym id:  ${id} nie istnieje.`);
            }
            if (!vehicle.avatar) {
                throw new NotFoundException(`Pojazd nie posiada avatara.`);
            }

            res.sendFile(
                vehicle.avatar,
                {
                    root: path.join(storageDir(), 'vehicle-avatars'),
                },
            )
        } catch (e) {
            throw e;
        }
    }


    async addTechnicalInfo(addTechnicalDataDto: AddTechnicalDataDto, vehId: string) {

        const {
            engineCapacity,
            enginePower,
            fuel,
            alternativeFuel,
            CO2Emission,
            avgFuelConsumption,
            totalSeats,
            seatedSeats,
            vehicleWeight,
            maxTrailerWeightWithBrakes,
            maxTrailerWeightWithoutBrakes,
            payload,
            grossWeight,
            numberOfAxles,
            axleSpacing,
            wheelSpacing,
            maxAxleLoad,
        } = addTechnicalDataDto

        const vehicle = await VehicleEntity.findOneBy({id: vehId});

        if (!vehicle) {
            throw new HttpException(
                {
                    message: `Pojazd, który chcesz edytować nie istnieje w bazie danych.`,
                    isSuccess: false,
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const vehicleTechInformation = new TechnicalDataEntity()
        vehicleTechInformation.engineCapacity = engineCapacity;
        vehicleTechInformation.enginePower = enginePower;
        vehicleTechInformation.fuel = fuel;
        vehicleTechInformation.alternativeFuel = alternativeFuel;
        vehicleTechInformation.CO2Emission = CO2Emission;
        vehicleTechInformation.avgFuelConsumption = avgFuelConsumption;
        vehicleTechInformation.totalSeats = totalSeats;
        vehicleTechInformation.seatedSeats = seatedSeats;
        vehicleTechInformation.vehicleWeight = vehicleWeight;
        vehicleTechInformation.maxTrailerWeightWithBrakes = maxTrailerWeightWithBrakes;
        vehicleTechInformation.maxTrailerWeightWithoutBrakes = maxTrailerWeightWithoutBrakes;
        vehicleTechInformation.payload = payload;
        vehicleTechInformation.grossWeight = grossWeight;
        vehicleTechInformation.numberOfAxles = numberOfAxles;
        vehicleTechInformation.axleSpacing = axleSpacing;
        vehicleTechInformation.wheelSpacing = wheelSpacing;
        vehicleTechInformation.maxAxleLoad = maxAxleLoad;
        vehicleTechInformation.vehicleProfile = vehicle;
        await vehicleTechInformation.save();
        return createResponse(true, 'Pomyślnie uzupełniono informacje.', 200);

    }

}
