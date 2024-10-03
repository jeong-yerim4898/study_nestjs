import { Body, Controller, Post, Headers, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipie';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { AccessTokenGuard, RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  async postTokenAccess(
    @Headers('authorization') rawToken: string
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    /**
     * {accessToken : {token}}
     */
    const newToken = await this.authService.rotateToekn(token,false);
    return {
      accessToken : newToken
    }
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  async postTokenRefresh(
    @Headers('authorization') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    /**
     * {refreshToken : {token}}
     */
    const newToken = await this.authService.rotateToekn(token,true);
    return {
      refreshToken : newToken
    }
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  postLoginEmail (
    @Headers('authorization') rawToken : string,
  ) {
    // email:password -> base64
    // aewreaerlrfjiowejroiwe -> email:password
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials)
  };

  @Post('register/email')
  postRegisterEmail(
    @Body()  body : RegisterUserDto
  ) {
    return this.authService.registerWithEmail(body)
  }
}
