import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { USER_ROLE } from '../../../types';

@Entity({
  database: 'fleetpro',
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    default: '',
  })
  name: string;

  @Column({
    default: '',
  })
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  //@TODO: Zrobić system aktywacyjny
  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({
    default: '',
  })
  avatar: string;

  @Column({
    type: 'enum',
    enum: USER_ROLE,
    enumName: 'user_role',
    default: USER_ROLE.USER,
  })
  role: USER_ROLE;

  @Column({
    default: '',
  })
  jobPosition: string;
}
