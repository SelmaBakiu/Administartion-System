import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Generated } from 'typeorm';
import { Auth } from './auth.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(
    'varchar',
    {
      length: 255,
      nullable: false,
    },
  )
  firstName: string;

  @Column(
    'varchar',
    {
      length: 255,
      nullable: false,
    },
  )
  lastName: string;

  @Generated('uuid')
  @Column()
  employeeId: string;

  @Column(
    'varchar',
    {
      length: 255,
      nullable: true,
    },
  )
  departmentId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  position: string;

  @Column({ type: 'date' , nullable: true })
  dateOfBirth: Date;

  @Column(
    'varchar',
    {
      length: 255,
      nullable: true,
    },
  )
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMINISTRATOR,
  })
  role: Role;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;
}
