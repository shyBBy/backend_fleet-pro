



export interface VehicleUpdateInterface {
    id: string,
    vehicleId: string,
    modifyByUserId: string,
    lastModifyDate: string,
    title: string,
    reason?: string,
}


export interface VehicleInterface extends VehicleUpdateInterface {
    id: string,
    vehicleType: string,
    name: string,
    model: string,
    registerNumber: string,
    isCurrentVehicleInspection: boolean,
    lastDateOfVehicleInspection: string | Date,
    nextDateOfVehicleInspection: string | Date,
    vehicleMileage: number,
    assignedToCompanyBranchId: string,
    assignedToDriverId: string,
    photo?: string,
    vinNumber: string,
    yearOfProduction: string,
    firstRegistrationDate: string,
    policyNumber: string,
}