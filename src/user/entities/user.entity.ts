import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {USER_ROLE} from '../../../types';

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

    @Column({
        default: false,
    })
    isActive: boolean;

    @Column({
        default: '',
    })
    activationCode: string;


    @Column({
        default: null,
        nullable: true,
    })
    avatar: string;

    @Column({
        type: 'enum',
        enum: USER_ROLE,
        enumName: 'user_role',
    })
    role: USER_ROLE;
    
    @Column({ 
      type: 'varchar', 
      array: true, 
      default: [] 
      
    })
    permissions: string[];

    @Column({
        default: '',
    })
    jobPosition: string;

    @Column({
        default: '',
    })
    placeName: string;


}
