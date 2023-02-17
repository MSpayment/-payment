import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { ProductService } from "src/product/product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Get 全ての登録した製品を取得
  @Get()
  getProducts() {}

  // Get 期間を指定して登録した製品を取得
  // Post 購入した製品を登録
  @Post()
  registerProduct() {}

  // Patch 登録した製品を編集
  @Patch()
  updateProduct() {}

  // Delete 登録した製品を削除//delete=falseとすることで削除判定。DBからは消さない
  @Delete()
  deleteProduct() {}
}
