import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterProductDto } from "src/products/dto/registerProduct.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // 今日の登録した製品を取得するメソッド
  async getProducts(month) {
    const products = await this.prisma.product.findMany({
      where: {
        boughtDay: {
          contains: month,
        },
      },
    });
    return products;
  }

  // 期間を指定して取得するメソッド
  // getProductsByTerm(userId: number, dto: SearchProductsByTermDto) {}

  // idを指定して一つの製品を取得するメソッド
  // getProductById(productId: number) {}

  // 製品を登録するメソッド
  async registerProduct(userId: number, dto: RegisterProductDto) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        userId,
      },
    });
    return product;
  }

  // // 登録した製品を更新するメソッド
  // updateProduct(userId: number, productId: number, dto: UpdateProductDto) {}

  // // (idを指定して?）削除するメソッド
  deleteProduct(productId: number) {
    const product = this.prisma.product.update({
      data: {
        deleted: true,
      },
      where: {
        id: productId,
      },
    });
    return product;
  }

  getTodayMonth(): string {
    const date: Date = new Date();
    const year: string = date.getFullYear().toString();
    const monthNum: number = date.getMonth() + 1;
    let month = monthNum.toString();
    if (month.length === 1) {
      month = `0${month}`;
    }
    return `${year}-${month}`;
  }
}
