import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

// 登録した製品を更新する際にクライアントから送信されるデータ型。
export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  boughtDay: string; // (仮)

  @IsString()
  @IsNotEmpty()
  boughtSite: string;

  @IsBoolean()
  isPaid?: boolean;
}
