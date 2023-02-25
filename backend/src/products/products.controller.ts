import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { RegisterProductDto } from "src/products/dto/registerProduct.dto";
import { ProductsService } from "src/products/products.service";

@UseGuards(AuthGuard("jwt-access"))
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get 全ての登録した製品を取得
  @Get()
  getProducts() {
    const month = this.productsService.getTodayMonth();
    return this.productsService.getProducts(month);
  }

  // Get 全ての登録した製品を取得
  @Get(":month")
  getProductsByMonth(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> },
    @Param("month") month: string
  ) {
    return this.productsService.getProducts(month);
  }

  // Get 期間を指定して登録した製品を取得
  // Post 購入した製品を登録
  @Post()
  registerProduct(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> },
    @Body() dto: RegisterProductDto
  ) {
    return this.productsService.registerProduct(req.user.id, dto);
  }

  // Patch 登録した製品を編集
  // @Patch()
  // updateProduct() {}

  // Delete 登録した製品を削除//delete=falseとすることで削除判定。DBからは消さない
  @Delete(":id")
  deleteProduct(@Param("id", ParseIntPipe) productId: number) {
    return this.productsService.deleteProduct(productId);
  }
}
