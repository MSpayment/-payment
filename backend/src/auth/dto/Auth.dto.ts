// サインアップ・ログイン・ログアウトの時に、クライアントがリクエストのボディにのせて送るデータ
// アクセストークンはリクエストヘッダに載せる。

// class-validator: https://www.npmjs.com/package/class-validator
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
