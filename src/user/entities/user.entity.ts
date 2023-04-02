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
        default: '',
    })
    avatar: string;

    @Column({
        type: 'enum',
        enum: USER_ROLE,
        enumName: 'user_role',
    })
    role: USER_ROLE;

    @Column({
        default: '',
    })
    jobPosition: string;

    @Column({
        default: '',
    })
    placeName: string;


}
