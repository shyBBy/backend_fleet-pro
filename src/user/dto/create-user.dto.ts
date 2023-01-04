export namespace UsersDto {
  export class UserDTO {
    id: string;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: USER_ROLE | any;

    constructor(userEntity: UserEntity) {
      this.id = userEntity.id;
      this.name = userEntity.name;
      this.surname = userEntity.surname;
      this.password = userEntity.password;
      this.role = USER_ROLE;
    }
  }
}
