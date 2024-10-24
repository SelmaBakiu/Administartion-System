import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => User, user => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: false })
  isDeleted: boolean;
}