import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


  @Entity({
    database: 'app',
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
  
}
