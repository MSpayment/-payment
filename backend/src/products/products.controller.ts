import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { RegisterProductDto } from "src/products/dto/registerProduct.dto";
import { UpdateProductDto } from "src/products/dto/updateProduct.dto";
import { ProductsService } from "src/products/products.service";

@UseGuards(AuthGuard("jwt-access"))
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get 全ての登録した製品を取得
  @Get()
  getProducts() {
    return this.productsService.getProducts();
  }

  // Get 全ての登録した製品を取得 //とりあえず、...products/23-02でリクエストを送ると、2023年の2月のデータが取得できる。
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

  // Patch 登録した製品を編集 //支払い済みにする場合はbodyにisPaid: trueを付け足してリクエストを送る
  @Patch(":id")
  updateProduct(
    @Req() req: Request,
    @Param("id", ParseIntPipe) productId: number,
    @Body() dto: UpdateProductDto
  ) {
    return this.productsService.updateProduct(productId, dto);
  }

  // Delete 登録した製品を削除//delete=falseとすることで削除判定。DBからは消さない
  @Delete(":id")
  deleteProduct(@Param("id", ParseIntPipe) productId: number) {
    return this.productsService.deleteProduct(productId);
  }
}
