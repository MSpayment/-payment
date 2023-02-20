import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ProductController } from "src/product/product.controller";
import { ProductService } from "src/product/product.service";

@Module({
  controllers: [ProductController],
  exports: [],
  imports: [PrismaModule],
  providers: [ProductService],
})
export class ProductModule {}
