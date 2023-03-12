export enum USER_ROLE {
    USER = 'Użytkownik',
    ADMIN = 'Administrator',
}

export interface UserCreate {
    email: string;
    password: string;
}

export interface UserProfile extends UserCreate {
    id: string;
    name: string;
    surname: string;
    isActive: Boolean;
    assignedToPlaceId: string;
    assignedToVehicleId?: string;
    avatar?: string;
    role: USER_ROLE | string;
    jobPosition: string;
    currentTokenId: string;
    activationCode: string;

}

export type UserRes = Pick<UserProfile, 'id' | 'role' | 'email'>;

export interface LoggedUserRes extends UserRes {
    name: string;
    surname: string;
}