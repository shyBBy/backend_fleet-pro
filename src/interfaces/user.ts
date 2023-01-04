export interface UserCreate {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface UserProfile extends UserCreate {
  id: string;
}
