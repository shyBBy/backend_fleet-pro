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
    isCurrentVehicleInspection: boolean;
    lastDateOfVehicleInspection: Date;
    nextDateOfVehicleInspection: Date;
    vehicleMileage: number;
    photo?: string;
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
    updateDate: Date;
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


export type GetOneVehResponse = VehicleProfileInterface

export type GetListOfVehiclesResponse = GetOneVehResponse[]

export interface GetPaginatedListOfAllVehiclesResponse {
    vehicles: GetListOfVehiclesResponse;
    pagesCount: number;
    resultsCount: number;
    badFilters?: FilterRecords;
}