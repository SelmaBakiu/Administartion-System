import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/signIn.dto';
import { User } from 'src/common/entitys/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(
    signupData: SignUpDTO,
  ): Promise<{ access_token: string; user: User }> {
    const existingAuth = await this.userRepository.findOne({
      where: { email: signupData.email },
    });

    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupData.password, salt);
    const createUserDto = new CreateUserDto();
    createUserDto.firstName = signupData.firstName;
    createUserDto.lastName = signupData.lastName;
    createUserDto.email = signupData.email;
    createUserDto.password = hashedPassword;

    const user = await this.userService.createUser(createUserDto);
    const token = await this.generateToken(user.id, user.role);

    return {
      access_token: token,
      user,
    };
  }

  async signIn(
    signinData: SignInDto,
  ): Promise<{ access_token: string; user: User }> {
    const user = await this.userRepository.findOne({
      where: { email: signinData.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      signinData.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = await this.generateToken(user.id, user.role);

    return {
      access_token: token,
      user,
    };
  }

  private async generateToken(
    userId: string,
    userRole: string,
  ): Promise<string> {
    return this.jwtService.signAsync({
      sub: userId,
      role: userRole,
    });
  }
}
