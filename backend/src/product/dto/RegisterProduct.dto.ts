// 製品を登録する際にクライアントから送信されるデータ型。
export class RegisterProductDto {
  name: string;

  price: number;

  boughtDay: string; // (仮)

  boughtSite: string;
}
