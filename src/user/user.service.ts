import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entitys/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from 'src/common/entitys/auth.entity';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['auth'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.authRepository.update(id, { isDeleted: true });
    await this.userRepository.update(id, { isDeleted: false });
  }

  async getUserRole(userId: number): Promise<Role> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user.role;
  }
}
