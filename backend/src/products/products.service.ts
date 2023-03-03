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
      orderBy: {
        boughtDay: "desc",
      },
      where: {
        boughtDay: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        },
      },
    });
    let productsEachDay = [];
    let prevDay = 0;
    let tmpObj = { day: 0, products: [] };

    products.forEach((e) => {
      const day = e.boughtDay.getDate();
      if (day !== prevDay) {
        // 日付が変わったら配列にオブジェクトを追加してtmpObjを初期化
        productsEachDay = [tmpObj, ...productsEachDay];
        tmpObj = { day, products: [] };
      }
      // console.log(e);
      tmpObj.products = [e, ...tmpObj.products];
      prevDay = day;
    });
    productsEachDay = [tmpObj, ...productsEachDay];
    productsEachDay = productsEachDay.slice(0, -1);
    return productsEachDay;
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
    const month = date.getMonth();

    return { month, year };
  }
}
