export class LastChangesEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({
    default: '',
  })
  title: string

  @Column({
    default: '',
  })
  reason: string
  
  
  @Column({
    default: '',
  })
  edditedByUser: string
  
  
}