import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthDto } from "src/auth/dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, // データベースのテーブル操作をする
    private readonly jwt: JwtService, // アクセストークンを発行する
    private readonly config: ConfigService // .envフィルから値を読み取る
  ) {}

  // サインアップ。
  async signup(dto: AuthDto) {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // DBに登録
    try {
      const user = this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword,
        },
      });
      return user;
    } catch (err) {
      throw new ForbiddenException("同じユーザがあったよ、残念...");
    }
  }

  // ログイン。アクセストークンを発行
  async login(dto: AuthDto) {
    // DBからユーザを取得
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    // ユーザが見つからない場合はエラー
    if (!user) {
      throw new ForbiddenException("emailが間違っているか、登録されていません");
    }

    // パスワードが正しいか
    const checkPassword = await bcrypt.compare(
      dto.password,
      user.hashedPassword
    );
    if (!checkPassword) {
      throw new ForbiddenException("emailが間違っているか、登録されていません");
    }
    // 問題なければ
    // リフレッシュトークンを発行
    const refreshToken = await this.getJwtRefreshToken(user.id, user.email);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    // DBにリフレッシュトークンを登録
    try {
      await this.prisma.user.update({
        data: { hashedRefreshToken },
        where: {
          id: user.id,
        },
      });
    } catch (e) {
      throw new ForbiddenException("なんてこったい");
    }

    // アクセストークンを返す
    const accessToken = await this.getJwtAccessToken(user.id, user.email);
    return {
      accessToken,
      refreshToken,
    };
  }

  // logout() {}

  // アクセストークンを更新;
  async updateAccessToken(userId: number, email: string): Promise<string> {
    return this.getJwtAccessToken(userId, email);
  }

  // アクセストークンを発行メソッド
  async getJwtAccessToken(userId: number, email: string): Promise<string> {
    const payload = {
      // payload: string|object|buffer 文字列にエンコードされて、JWTのペイロードセクションに使われる。
      // payloadには任意の値が設定できる
      email,
      sub: userId, // sub: 認証の対象となるユーザの識別子を設定する。
    };
    const accessToken = await this.jwt.signAsync(payload, {
      // options: JetSignOptions
      expiresIn: "5m",
      secret: this.config.get("JWT_ACCESS_SECRET"),
    });
    return accessToken;
  }

  // リフレッシュトークンを発行メソッド
  async getJwtRefreshToken(userId: number, email: string): Promise<string> {
    const refreshToken = await this.jwt.signAsync(
      {
        // payload
        email,
        sub: userId,
      },
      {
        // options
        expiresIn: "7d", // リフレッシュトークンの有効期限は7日間
        secret: this.config.get("JWT_REFRESH_SECRET"),
      }
    );
    return refreshToken;
  }

  async clearRefreshToken(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new ForbiddenException("指定されたidのユーザが存在しない");
    }

    const result = await this.prisma.user.update({
      data: {
        hashedRefreshToken: "",
      },
      where: {
        id: userId,
      },
    });
    return result;
  }
}
