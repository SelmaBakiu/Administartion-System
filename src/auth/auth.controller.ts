import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signUp.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { SignInDto } from './dto/signIn.dto';
import { User } from 'src/common/entitys/user.entity';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Public()
  @Post('/signup')
  async signUp(@Body() signUpDTO:SignUpDTO): Promise<{ token: string; user: User }> {
    return await this.authService.signUp(signUpDTO);
  }

  @Public()
  @Post('/signin')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<{ token: string; user: User } > {
    return await this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
      console.log('Received request with email:', body.email);
      return this.authService.forgotPassword(body.email);
  }

}
