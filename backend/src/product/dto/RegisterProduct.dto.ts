import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// 製品を登録する際にクライアントから送信されるデータ型。
export class RegisterProductDto {
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
}
