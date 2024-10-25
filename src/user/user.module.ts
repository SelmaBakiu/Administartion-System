import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../common/entitys/user.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';



@Module({
  imports: [TypeOrmModule.forFeature([User]), FirebaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}