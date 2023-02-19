import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { AuthDto } from "src/auth/dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Post サインアップ
  @Post("signup")
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  // Post ログイン
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto
  ): Promise<string> {
    const accessToken: string = await this.authService.login(dto);
    const refreshToken: string = await this.authService.login(dto);
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
    // リフレッシュトークンをcookieに付与
    res.cookie(
      "refresh-token", // name
      refreshToken, // value
      {
        // options
        httpOnly: true,
        sameSite: "none",
        secure: false,
      }
    );
    return "OK";
  }

  @UseGuards(AuthGuard("jwt-access"))
  @Get("accessToken_test")
  guradtest_accessToken() {
    return "やったね！";
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Get("refreshToken_test")
  guradtest_refreshToken() {
    return "やったね！";
  }

  @Post("refresh")
  refresh(@Req() req: Request, @Res() res: Response, dto: AuthDto) {
    // リフレッシュトークンをクッキーから取得
    const refreshToken = req.cookies["refresh-token"];
    // 新しいアクセストークンを取得
    const accessToken = this.authService.updateAccessToken(
      dto.email,
      refreshToken
    );
    // アクセストークンを更新
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: false,
    });
  }

  // Post ログアウト
  // @Post("logout")
  // logout() {}
}
