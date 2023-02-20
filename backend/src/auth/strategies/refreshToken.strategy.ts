import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh"
) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {
    super(
      // 親クラスのコンストラクタ
      {
        ignoreExpiration: false, // jwtの有効期限が切れたら無効になるように
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => {
            let jwt = null;
            if (req && req.cookies) {
              jwt = req.cookies["refresh-token"];
              console.log("redresh入った。", config.get("JWT_REFRESH_SECRET"));
            }
            return jwt;
          },
        ]),
        secretOrKey: config.get("JWT_REFRESH_SECRET"),
      }
    );
  }

  async validate(payload: { email: string; sub: number }) {
    console.log("refreshこっちも入った。");
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    delete user.hashedRefreshToken;

    return user;
  }
}
