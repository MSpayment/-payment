// サインアップ・ログイン・ログアウトの時に、クライアントがリクエストのボディにのせて送るデータ
// アクセストークンはリクエストヘッダに載せる。

// class-validator: https://www.npmjs.com/package/class-validator
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string;
}
