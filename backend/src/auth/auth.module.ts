import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  controllers: [AuthController],
  exports: [],
  imports: [PrismaModule, JwtModule.register({}), ConfigModule],
  providers: [AuthService],
})
export class AuthModule {}
