import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { ProductController } from "./product/product.controller";
import { ProductModule } from "./product/product.module";
import { ProductService } from "./product/product.service";

@Module({
  controllers: [AppController, ProductController, AuthController],
  imports: [
    ProductModule,
    AuthModule,
    PrismaModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [AppService, ProductService, AuthService, PrismaService],
})
export class AppModule {}
