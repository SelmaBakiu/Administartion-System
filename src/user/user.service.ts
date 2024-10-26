import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, ILike, Repository, UpdateResult } from 'typeorm';
import { User } from 'src/common/entitys/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
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
      //TODO check if departament is valid

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
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllUsers(
    page: number,
    limit: number,
    firstName?: string,
    lastName?: string,
  ): Promise<{ data: User[]; all: number; page: number }> {
    try {
      page = page || 0;
      limit = limit || 10;

      const data = await this.userRepository.find({
        where: {
          firstName: firstName ? ILike(`%${firstName}%`) : undefined,
          lastName: lastName ? ILike(`%${lastName}%`) : undefined,
        },
        order: { firstName: 'ASC' },
        take: limit,
        skip: page * limit,
      });

      const total = await this.userRepository.count({
        where: {
          firstName: firstName ? ILike(`%${firstName}%`) : undefined,
          lastName: lastName ? ILike(`%${lastName}%`) : undefined,
          isDeleted: false,
        },
      });

      return { data, all: total, page };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getUserByDepartmentId(departmentId: string): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { departmentId } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.update(id, { isDeleted: true });
    } catch (err) {
      throw new Error(err);
    }
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
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
