export class OrderItem {
  constructor(
    public productId: string,
    public productName: string,
    public productImage: string,
    public quantity: number,
    public price: number
  ) {}
}
