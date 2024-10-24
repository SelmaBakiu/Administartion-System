import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { LogInDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('/signup')
  async signUp(@Body() SignUpDTO:SignUpDTO): Promise<{ access_token: string; user: any }> {
    return await this.authService.signup(SignUpDTO);
  }

  @Public()
  @Post('/login')
  async signIn(
    @Body() LogInDto: LogInDto,
  ): Promise<{ message: string; data: { access_token: string; user: any } }> {
    const loginResult = await this.authService.logIn(LogInDto);
    return {
      message: 'Login successful',
      data: loginResult,
    };
  }
}
