import { Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Branches extends BaseEntity{
  @PrimaryGeneratedColumn()
  ifsc: string;

  @Column({
    nullable: true,
  })
  bank_id: number;

  @Column({
    nullable: true,
  })
  branch: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  city: string ;

  @Column({
    nullable: true,
  })
  district: string;

  @Column({
    nullable: true,
  })
  state: string;

  @Column({
    nullable: true,
  })
  bank_name: string;

  
}


