import { Injectable } from "@nestjs/common";
import { RegisterProductDto } from "src/product/dto/RegisterProduct.dto";
import { SearchProductsByTermDto } from "src/product/dto/SearchProducts.dto";
import { UpdateProductDto } from "src/product/dto/UpdateProduct.dto";

@Injectable()
export class ProductService {
  // 全ての登録した製品を取得するメソッド
  getProducts(userId: number) {}

  // 期間を指定して取得するメソッド
  getProductsByTerm(userId: number, dto: SearchProductsByTermDto) {}

  // idを指定して一つの製品を取得するメソッド
  getProductById(productId: number) {}

  // 製品を登録するメソッド
  registerProduct(userId: number, dto: RegisterProductDto) {}

  // 登録した製品を更新するメソッド
  updateProduct(userId: number, productId: number, dto: UpdateProductDto) {}

  // (idを指定して?）削除するメソッド
  deleteProduct(userId: number, productId: number) {}
}
