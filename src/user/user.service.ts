import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/common/entitys/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { paginate } from 'src/common/util/pagination';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UpdateResult> {
    try {
      const existingUser = await this.userRepository.findOne({ where: { id } });
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }
      const user = this.userRepository.update(id, userData);
      console.log(user);
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserById(id: string): Promise<User> {
    try{
      const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
    }catch(err){
      throw new Error(err);
    }
  }

  async getAllUsers(
    page: number,
    limit: number,
    firstName?: string,
    lastName?: string,
  ) {
    const filter = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    };
    const sort: FindOptionsOrder<User> = {
      createdAt: 'DESC',
    }

    return await paginate(
      page,
      limit,
      this.userRepository,
      filter,
      sort
    );
  }

  async deleteUser(id: string): Promise<void> {
    try{
      const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(id, { isDeleted: true });
    }catch(err){
      throw new Error(err);
    }
  }

  async uploadImage(file: Express.Multer.File, userId:string): Promise<string> {
    try {
      const profileImageUrl = await this.firebaseService.uploadFile(
        file,
        'profileImages',
        'square',
      );
      await this.userRepository.update(userId, {
        profileImageUrl,
      });

      return profileImageUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new ConflictException('Failed to upload file');
    }
  }

  
}
