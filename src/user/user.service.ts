import { Injectable } from '@nestjs/common';
import {UserCreateDto} from "./dto/create-user.dto";



@Injectable()
export class UserService {
  create(createUserDto: UserCreateDto) {
    
    const {
      name,
      surname,
      email,
      password,
    } = createUserDto;
    
  }

}
