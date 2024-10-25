import { Entity, PrimaryGeneratedColumn, Column, OneToOne, Generated } from 'typeorm';

@Entity()
export class Departament {

    @Generated('uuid')
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column(
        'varchar',
        {
        length: 255,
        nullable: false,
        unique: true,
        },
    )
    name: string;
    
    @Column(
        'varchar',
        {
        length: 255,
        nullable: true,
        },
    )
    description: string;

    @Column(
        'varchar',
        {
        length: 255,
        nullable: false,
        },
    )
    parentDepartamentId: string;
    }
