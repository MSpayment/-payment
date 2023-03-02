import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import * as bycript from "bcrypt";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { AuthDto } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  @Get("csrf")
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }

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
    const { accessToken, refreshToken } = await this.authService.login(dto);

    // アクセストークンをcookieに付与
    res.cookie(
      "access-token", // name
      accessToken, // value
      {
        // options
        httpOnly: true,
        sameSite: "lax",
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
        sameSite: "lax",
        secure: false,
      }
    );

    return "ok";
  }

  // アクセストークン更新ルート
  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  async refresh(
    @Req()
    req: {
      cookies: any;
      user: Omit<User, "hashedPassword" & "hashedRefreshToken">;
    },
    @Res({ passthrough: true }) res: Response
  ) {
    // リフレッシュトークンをクッキーから取得
    const refreshToken = await req.cookies["refresh-token"];
    // 一応DBに保存されているリフレッシュトークンと合っているかも確かめる。
    // DBに保存されているハッシュ化したリフレッシュトークンも取得
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    const { hashedRefreshToken } = user;
    const isValid = await bycript.compare(refreshToken, hashedRefreshToken);
    if (!isValid) {
      throw new ForbiddenException("リフレッシュトークンが不正");
    }

    // 問題なければ新しいアクセストークンを取得
    const accessToken = await this.authService.updateAccessToken(
      user.id,
      user.email
    );
    // アクセストークンを更新
    res.cookie(
      "access-token", // name
      accessToken, // value
      {
        // options
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      }
    );
    return { message: "ok" };
  }

  // Post ログアウト
  @UseGuards(AuthGuard("jwt-access"))
  @Post("logout")
  logout(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> },
    @Res({ passthrough: true }) res: Response
  ) {
    res.clearCookie("access-token");
    this.authService.clearRefreshToken(req.user.id);
    return { message: "ok" };
  }
}
