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
import { ProductsController } from "./products/products.controller";
import { ProductsModule } from "./products/products.module";
import { ProductsService } from "./products/products.service";

@Module({
  controllers: [AppController, ProductsController, AuthController],
  imports: [
    ProductsModule,
    AuthModule,
    PrismaModule,
    JwtModule.register({}),
    ConfigModule,
  ],
  providers: [AppService, ProductsService, AuthService, PrismaService],
})
export class AppModule {}
