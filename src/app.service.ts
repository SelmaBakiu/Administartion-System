import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class AppService {
  getHello() {
    console.log('Database Config:', {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      database: process.env.DB_NAME,
    });
  }
}
