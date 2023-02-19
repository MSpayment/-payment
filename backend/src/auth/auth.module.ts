import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { JwtAccessStrategy } from "src/auth/strategies/accessToken.strategy";
import { JwtRefreshStrategy } from "src/auth/strategies/refreshToken.strategy";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  controllers: [AuthController],
  exports: [],
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
