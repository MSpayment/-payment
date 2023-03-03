import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: "http://localhost:3000",
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.use(
  //   csurf({
  //     cookie: {
  //       httpOnly: true, // javascriptから読み込めない
  //       sameSite: "none",
  //       secure: true, // デバッグ用にfaulse//cookieをHTTPSのみで使用するかどうか
  //     },
  //     value: (req: Request) =>
  //       // value: 検証のため呼び出されるリクエストからトークンを読み取る関数
  //       req.header("csrf-token"), // ヘッダーの要素に csrf-token: トークン が正しく存在しないと、ログインできなくなる。
  //   })
  // );

  await app.listen(3005);
}

bootstrap();
