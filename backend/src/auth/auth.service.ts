import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthDto } from "src/auth/dto/auth.dto";
import { Token } from "src/auth/interfaces/auth.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, // データベースのテーブル操作をする
    private readonly jwt: JwtService, // アクセストークンを発行する
    private readonly cofig: ConfigService // .envフィルから値を読み取る
  ) {}

  // サインアップ。
  async signup(dto: AuthDto) {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    // DBに登録
    const user = this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword,
      },
    });
    return user;
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
    const refreshToken = await this.getRefreshToken(user.id, user.email);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
    // DBにリフレッシュトークンを登録
    this.prisma.user.update({
      data: { ...user, hashedRefreshToken },
      where: {
        id: user.id,
      },
    });
    // アクセストークンを返す
    return this.getJwtAccessToken(user.id, user.email);
  }

  // logout() {}

  // アクセストークンを発行メソッド
  async getJwtAccessToken(userId: number, email: string): Promise<Token> {
    const accessToken = await this.jwt.signAsync(
      {
        // payload: string|object|buffer 文字列にエンコードされて、JWTのペイロードセクションに使われる。
        // payloadには任意の値が設定できる
        email,
        sub: userId, // sub: 認証の対象となるユーザの識別子を設定する。
      },

      {
        // options: JetSignOptions
        expiresIn: "5m",
        secret: this.cofig.get("JWR_ACCESS_SEQRET"),
      }
    );

    return { token: accessToken };
  }

  // リフレッシュトークンを発行メソッド
  async getRefreshToken(userId: number, email: string): Promise<string> {
    const refreshToken = await this.jwt.signAsync(
      {
        // payload
        email,
        sub: userId,
      },
      {
        // options
        expiresIn: "7d", // リフレッシュトークンの有効期限は7日間
        secret: this.cofig.get("JWT_REFRESH_SEQLET"),
      }
    );
    return refreshToken;
  }
}
