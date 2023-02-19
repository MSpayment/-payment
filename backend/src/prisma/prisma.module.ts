import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  exports: [PrismaService],
  imports: [ConfigModule],
  providers: [PrismaService],
})
export class PrismaModule {}
