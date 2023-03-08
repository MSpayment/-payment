import { ForbiddenException, Injectable } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RegisterProductDto } from "src/products/dto/registerProduct.dto";
import { UpdateProductDto } from "src/products/dto/updateProduct.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // 今日の登録した製品を取得するメソッド
  async getProducts(
    { month, year } = this.getTodayMonth()
  ): Promise<{ date: Date; id: number; products: Product[] }[]> {
    const products = await this.prisma.product.findMany({
      orderBy: {
        boughtDay: "asc",
      },
      where: {
        boughtDay: {
          gte: new Date(year, month, 1),
          lte: new Date(year, month + 1, 0),
        },
      },
    });

    if (!products[0]) return [];
    let count = 0;
    let tmpObj: { date: Date; id: number; products: Product[] } | null;
    const productsEachDay: { date: Date; id: number; products: Product[] }[] =
      products.map((val, index) => {
        if (!tmpObj) {
          tmpObj = { date: val.boughtDay, id: 0, products: [val] };
          count += 1;
          return null;
        }

        if (
          val.boughtDay.getDate() === tmpObj.date.getDate() &&
          val.boughtDay.getMonth() === tmpObj.date.getMonth() &&
          val.boughtDay.getFullYear() === tmpObj.date.getFullYear()
        ) {
          tmpObj.products = [val, ...tmpObj.products];
          return null;
        }
        const dayObj = tmpObj;
        tmpObj = { date: val.boughtDay, id: count, products: [val] };
        count += 1;
        return dayObj;
      });
    productsEachDay.push(tmpObj);
    const result = productsEachDay.filter((val) => val !== null);
    return result;
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

  // (idを指定して?）削除するメソッド
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

  // まとめて削除
  async deleteProducts() {
    const result = await this.prisma.product.deleteMany({
      where: {
        deleted: true,
      },
    });
    return result;
  }

  getTodayMonth(): { month: number; year: number } {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();

    return { month, year };
  }
}
