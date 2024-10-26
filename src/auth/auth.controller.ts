import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from './dto/signIn.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDTO:SignUpDTO): Promise<{ access_token: string; user: any }> {
    return await this.authService.signUp(signUpDTO);
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ message: string; data: { access_token: string; user: any } }> {
    return {
      message: 'Login successful',
      data: await this.authService.signIn(signInDto),
    };
  }
}
