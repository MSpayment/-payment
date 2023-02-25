import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductsController } from "src/products/products.controller";
import { ProductsService } from "src/products/products.service";

@Module({
  controllers: [ProductsController],
  exports: [],
  imports: [PrismaModule],
  providers: [ProductsService],
})
export class ProductsModule {}
