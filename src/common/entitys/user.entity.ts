import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @Generated('uuid')
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  firstName: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  lastName: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMINISTRATOR,
  })
  role: Role;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  @OneToOne(() => User)
  departmentId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  position: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  address: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  profileImageUrl: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
