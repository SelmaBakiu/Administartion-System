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
        nullable: true,
        },
    )
    parentDepartamentId: string;

    @Column(
        'boolean',
        {
        default: false,
        },
    )
    isDeleted: boolean;
    }
