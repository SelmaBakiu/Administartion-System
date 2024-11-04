import { Entity, PrimaryGeneratedColumn, Column, Generated } from 'typeorm';

@Entity()
export class Department {
  @Generated('uuid')
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  name: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  description: string;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  parentDepartmentId: string;

  @Column('boolean', {
    default: false,
  })
  isDeleted: boolean;
}
