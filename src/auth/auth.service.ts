import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Auth } from 'src/common/entitys/auth.entity';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupData: SignUpDTO): Promise<{ access_token: string; user: any }> {

    const existingAuth = await this.authRepository.findOne({
      where: { email: signupData.email },
      relations: ['user'],
    });

    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }
    const createUserDto = new CreateUserDto();
    createUserDto.firstName = signupData.firstName;
    createUserDto.lastName = signupData.lastName;
    const user = await this.userService.createUser(createUserDto);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupData.password, salt);

    const auth = this.authRepository.create({
      email: signupData.email,
      password: hashedPassword,
      user,
    });

    await this.authRepository.save(auth);

    const token = await this.generateToken(auth.id, user.id);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: auth.email,
        ...user,
      },
    };
  }

  async logIn(signinData: LogInDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = signinData;

    const auth = await this.authRepository.findOne({
      where: { email },
      relations: ['user'],
    });

    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, auth.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(auth.id, auth.user.id);

    return {
      access_token: token,
      user: {
        id: auth.user.id,
        email: auth.email,
        ...auth.user,
      },
    };
  }

  private async generateToken(authId: number, userId: number): Promise<string> {
    return this.jwtService.signAsync({
      sub: authId,
      userId: userId,
    });
  }
}