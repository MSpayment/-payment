import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  "jwt-access"
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
              jwt = req.cookies["access-token"];
              console.log("入った。", jwt);
            }
            return jwt;
          },
        ]),
        secretOrKey: config.get("JWT_ACCESS_SECRET"),
      }
    );
  }

  // ガードを通る時に呼ばれる
  async validate(payload: { email: string; sub: number }) {
    console.log("こっちも入った。");
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
