import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { RegisterProductDto } from "src/product/dto/RegisterProduct.dto";
import { ProductService } from "src/product/product.service";

@UseGuards(AuthGuard("jwt-access"))
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Get 全ての登録した製品を取得
  @Get()
  getProducts(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> }
  ) {
    return this.productService.getProducts(req.user.id);
  }

  // Get 全ての登録した製品を取得
  // @Get(":year-month")
  // getProducts(
  //   @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> },
  //   @Param("id", ParseIntPipe) param: string
  // ) {
  //   return this.productService.getProducts(req.user.id);
  // }

  // Get 期間を指定して登録した製品を取得
  // Post 購入した製品を登録
  @Post()
  registerProduct(
    @Req() req: { user: Omit<User, "hashedPassword" & "hashedRefreshToken"> },
    @Body() dto: RegisterProductDto
  ) {
    console.log(dto);
    return this.productService.registerProduct(req.user.id, dto);
  }

  // Patch 登録した製品を編集
  // @Patch()
  // updateProduct() {}

  // Delete 登録した製品を削除//delete=falseとすることで削除判定。DBからは消さない
  // @Delete()
  // deleteProduct() {}
}
