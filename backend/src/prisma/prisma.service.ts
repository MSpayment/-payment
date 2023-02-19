import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

// PrismaClientの機能でデータベース操作をすることができる。

@Injectable()
// PrismaClientを継承したものをPrismaServiceとする。
// PrismaClient: https://www.prisma.io/docs/concepts/components/prisma-client
export class PrismaService extends PrismaClient {
  // ConfigServiceをDependancyInjection。.envから読み込むために使う。
  // ConfigServise: https://docs.nestjs.com/techniques/configuration
  constructor(private readonly config: ConfigService) {
    // PrismaClientのコンストラクタにはデータベースのURLを渡す。
    super({
      datasources: {
        db: {
          url: config.get("DATABASE_URL"),
        },
      },
    });
  }
}
