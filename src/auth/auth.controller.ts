import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe, PasswordPipe } from './pipe/password.pipie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('token/access')
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
  async postTokenRefresh(
    @Headers('authorization') rawToken: string
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
    @Body('email') email : string,
    @Body('nickname') nickname : string,
    @Body('password', new MaxLengthPipe(8, '비밃번호'), new MinLengthPipe(3)) password : string
  ) {
    return this.authService.registerWithEmail({
      nickname, email,password
    })
  }
}
