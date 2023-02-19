import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { AuthDto } from "src/auth/dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authSerice: AuthService) {}

  // Post サインアップ
  @Post("signup")
  signup(@Body() dto: AuthDto) {
    return this.authSerice.signup(dto);
  }

  // Post ログイン
  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto
  ): string {
    const accessToken = this.authSerice.login(dto);
    // アクセストークンをcookieに付与
    res.cookie(
      "access-token", // name
      accessToken, // value
      {
        // options
        httpOnly: true,
        sameSite: "none",
        secure: false,
      }
    );
    return "OK";
  }

  // Post ログアウト
  // @Post("logout")
  // logout() {}
}
