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
  role: USER_ROLE;
  jobPosition: string;
  currentTokenId: string;
  
}
