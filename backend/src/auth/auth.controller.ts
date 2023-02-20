import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
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
  guradtest_refreshToken(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> }
  ) {
    console.log("id::::", req.user.id);
    console.log("rarararararaarara");
    return `やったね！${req.user.id}`;
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Patch("refresh")
  async refresh(
    @Req()
    req: {
      cookies: any;
      user: Omit<User, "hashedPassword" & "hashedRefreshToken">;
    },
    @Res() res: Response
  ) {
    // リフレッシュトークンをクッキーから取得
    const refreshToken = await req.cookies["refresh-token"];
    // DBに保存されているハッシュ化したリフレッシュトークンも取得
    const user = await this.prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    // const { hashedRefreshToken } = user;
    // // const isValid = await bcrypt.compare(refreshToken, hashedRefreshToken);
    // // if (!isValid) {
    // //   throw new ForbiddenException("リフレッシュトークンが不正");
    // // }

    // 新しいアクセストークンを取得
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
        sameSite: "none",
        secure: false,
      }
    );
    console.log(req.user.id, user, accessToken);
  }

  // Post ログアウト
  // @Post("logout")
  // logout() {}
}
