import { USER_ROLE } from 'src/interfaces/user';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  database: 'fleetpro',
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @Column()
  avatar: string;

  @Column()
  role: string | USER_ROLE;

  @Column()
  jobPosition: string;
  
  @Column()
  currentTokenId: string;
}
