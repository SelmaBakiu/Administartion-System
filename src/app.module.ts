import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './common/entitys/user.entity';
import { FirebaseModule } from './firebase/firebase.module';
import { DepartamentModule } from './departament/departament.module';
import { Departament } from './common/entitys/departament.entity';
import { ChatModule } from './chat/chat.module';
import { Message } from './common/entitys/message.entiry';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Departament,Message],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    FirebaseModule,
    DepartamentModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
