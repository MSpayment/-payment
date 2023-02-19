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
            }
            return jwt;
          },
        ]),
        secretOrKey: config.get("JWT_REFRESH_SEQRET"),
      }
    );
  }

  async validate(payload: { email: string; sub: number }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return user;
  }
}
