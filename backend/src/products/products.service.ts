import { ForbiddenException, Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterProductDto } from "src/products/dto/registerProduct.dto";
import { UpdateProductDto } from "src/products/dto/updateProduct.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // 今日の登録した製品を取得するメソッド
  async getProducts({ month, year } = this.getTodayMonth()) {
    const products = await this.prisma.product.findMany({
      where: {
        boughtDay: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month, 0),
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

  // 登録した製品を更新するメソッド
  async updateProduct(
    productId: number,
    dto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new ForbiddenException("指定されたidのプロダクトがない!");
    }
    const result: Product = await this.prisma.product.update({
      data: {
        id: productId,
        ...dto,
        updatedAt: new Date(),
      },
      where: {
        id: productId,
      },
    });
    return result;
  }

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

  getTodayMonth(): { month: number; year: number } {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    return { month, year };
  }
}
