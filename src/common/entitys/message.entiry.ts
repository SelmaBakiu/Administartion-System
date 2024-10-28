
import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    CreateDateColumn 
  } from 'typeorm';
  import { User } from './user.entity';
  
  @Entity()
  export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    content: string;
  
    @ManyToOne(() => User)
    sender: User;
  
    @ManyToOne(() => User)
    receiver: User;
  
    @Column({ default: false })
    isRead: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  }