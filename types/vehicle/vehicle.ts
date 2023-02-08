import {FilterRecords} from "../filter";

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