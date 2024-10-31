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
import { generatePassword } from 'src/common/utils/generatePassword';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  async signUp(signupData: SignUpDTO): Promise<{ token: string; user: User }> {
    const existingAuth = await this.userRepository.findOne({
      where: { email: signupData.email },
    });

    if (existingAuth) {
      throw new ConflictException('Email already exists');
    }

    const password = generatePassword();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const createUserDto = new CreateUserDto();
    createUserDto.firstName = signupData.firstName;
    createUserDto.lastName = signupData.lastName;
    createUserDto.email = signupData.email;

    const user = await this.userService.createUser(createUserDto);
    user.password = hashedPassword;
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Welcome to the app',
      context: `Your password is ${password}. Please change your password after login.`,
    });
    const token = await this.generateToken(user.id, user.role);

    return {
      token: token,
      user,
    };
  }

  async signIn(signinData: SignInDto): Promise<{ token: string; user: User }> {
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
      token: token,
      user,
    };
  }


  async forgotPassword(userEmail: string): Promise<User> {
    try {
      
      const user = await this.userRepository.findOne({
        where: { email: userEmail },
      });
    
      if (!user) {
        throw new UnauthorizedException('Invalid user');
      }

      const password = generatePassword();
      console.log('New password is :', password);
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Forgot Password',
        context: `Your new password is ${password}.
        Please change your password after login.`,
      });

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      
      return await this.userRepository.save(user);
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new Error(`Failed to process forgot password: ${err.message}`);
    }
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
