import {FilterRecords} from "../filter";


export enum VEHICLE_BRAND {
    Mercedes = 'Mercedes',
    Renault = 'Renault',
    Opel = 'Opel',
    Nissan = 'Nissan',
    Mazda = 'Mazda',
    Porsche = 'Porsche',
    Kia = 'Kia',
    Volkswagen = 'Volkswagen',
    Ford = 'Ford',
    Inne = 'Inne'
}

export enum VEHICLE_MODEL {
    Sprinter = 'Sprinter',
    Master = 'Master',
    Ceed = 'Ceed',
    Insignia = 'Insignia',
    Golf = 'Golf',
    Koleos = 'Koleos',
    Optima = 'Optima',
    Cayenne = 'Cayenne',
    Inne = 'Inne'
}

export enum VEHICLE_TYPE {
    Osobowy = 'Osobowy',
    Dostawczy = 'Dostawczy',
    Inny = 'Inny'
}

export interface VehicleUpdateInterface {
    id: string;
    vehicleId: string;
    modifyByUserId: string;
    lastModifyDate: string;
    title: string;
    reason?: string;
}

export interface VehicleProfileCreate {
    vehicleType: string;
    name: string;
    model: string;
    registerNumber: string;
    lastDateOfVehicleInspection: Date;
    nextDateOfVehicleInspection: Date;
    vehicleMileage: number;
    vinNumber: string;
    yearOfProduction: string;
    firstRegistrationDate: string;
    policyNumber: string;
    placeName: string;
    addedByUserId: string;
}


// export interface VehicleUpdateInterface extends VehicleProfileInterface{
//     vehicleId: string;
//     modifyByUserId: string;
//     lastModifyDate: string;
//     title: string;
//     reason?: string;
// }

export interface VehicleProfileInterface extends VehicleProfileCreate {
    id: string;
    editedByUserId: string;
}

// export interface VehicleInterface extends VehicleUpdateInterface {
//     id: string;
//     vehicleType: string;
//     name: string;
//     model: string;
//     registerNumber: string;
//     isCurrentVehicleInspection: boolean;
//     lastDateOfVehicleInspection: string | Date;
//     nextDateOfVehicleInspection: string | Date;
//     vehicleMileage: number;
//     assignedToCompanyBranchId: string;
//     assignedToDriverId: string;
//     photo?: string;
//     vinNumber: string;
//     yearOfProduction: string;
//     firstRegistrationDate: string;
//     policyNumber: string;
// }

export interface TechnicalDataInterface {
    id: number;
    engineCapacity: number;
    enginePower: number;
    fuel: string;
    alternativeFuel: string;
    CO2Emission: number;
    avgFuelConsumption: number;
    totalSeats: number;
    seatedSeats: number;
    vehicleWeight: number;
    maxTrailerWeightWithBrakes: number;
    maxTrailerWeightWithoutBrakes: number;
    payload: number;
    grossWeight: number;
    numberOfAxles: number;
    axleSpacing: number;
    wheelSpacing: number;
    maxAxleLoad: number;
    vehicleWidth: number;
    vehicleLenght: number;
    vehicleHeight: number;
    cargoBedWidth: number;
    cargoBedLenght: number;
    cargoBedHeight: number;
}


export type GetOneVehResponse = VehicleProfileInterface

export type GetListOfVehiclesResponse = GetOneVehResponse[]

export interface GetPaginatedListOfAllVehiclesResponse {
    vehicles: GetListOfVehiclesResponse;
    pagesCount: number;
    resultsCount: number;
    badFilters?: FilterRecords;
}