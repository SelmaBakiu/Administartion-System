import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from 'src/common/entitys/user.entity';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generatePassword } from 'src/common/utils/generatePassword';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseService: FirebaseService,
    private mailService: MailService,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email, isDeleted: false },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const password = generatePassword();
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({
        ...userData,
        department: userData.departmentId
          ? { id: userData.departmentId }
          : undefined,
        password: hashedPassword,
      });

      await this.mailService.sendMail({
        to: user.email,
        subject: 'Welcome to the app',
        context: `Your password is ${password}. Please change your password after login.`,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UpdateResult> {
    const existingUser = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: userData.email, isDeleted: false },
      });

      if (emailExists) {
        throw new ConflictException('Email already in use');
      }
    }

    const updateData = {
      ...userData,
      department: userData.departmentId
        ? { id: userData.departmentId }
        : undefined,
    };
    console.log(updateData);

    return await this.userRepository.update(id, updateData);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['department'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserForChat(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isDeleted: false },
      select: ['id', 'firstName', 'lastName', 'profileImageUrl'],
      order: { firstName: 'ASC', lastName: 'ASC' },
    });
  }

  async getAllUsersByDepartmentId(
    page: number = 0,
    limit: number = 10,
    firstName?: string,
    lastName?: string,
    departmentId?: string,
  ): Promise<{ data: User[]; all: number; page: number }> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.department', 'department')
      .where('user.isDeleted = :isDeleted', { isDeleted: false });

    if (firstName) {
      queryBuilder.andWhere('LOWER(user.firstName) LIKE LOWER(:firstName)', {
        firstName: `%${firstName}%`,
      });
    }

    if (lastName) {
      queryBuilder.andWhere('LOWER(user.lastName) LIKE LOWER(:lastName)', {
        lastName: `%${lastName}%`,
      });
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', { departmentId });
    }

    const [data, total] = await queryBuilder
      .orderBy('user.firstName', 'ASC')
      .addOrderBy('user.lastName', 'ASC')
      .take(limit)
      .skip(page * limit)
      .getManyAndCount();

    return { data, all: total, page };
  }

  async findUserByDepartmentId(departmentId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        department: { id: departmentId },
        isDeleted: false,
      },
      relations: ['department'],
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(id, { isDeleted: true });
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const profileImageUrl = await this.firebaseService.uploadFile(
        file,
        'profileImages',
        'square',
      );

      await this.userRepository.update(userId, { profileImageUrl });
      return profileImageUrl;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async changePassword(
    id: string,
    resetPasswordDto:ResetPasswordDto
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const salt = await bcrypt.genSalt();
    if (!(await bcrypt.compare(resetPasswordDto.oldPassword, user.password)).valueOf()) {
      throw new BadRequestException('Old passsword is not current');
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, salt);
    await this.userRepository.update(id, { password: hashedPassword });
  }
}
