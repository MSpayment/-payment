// 登録した製品を更新する際にクライアントから送信されるデータ型。
export class UpdateProductDto {
  name: string;

  price?: number;

  boughtDay: string;

  boughtSite: string;
}
