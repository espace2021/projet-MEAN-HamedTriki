import { OrderItem } from './order-item';

export class Order {
  constructor(
    public _id: string,
    public userId: string,
    public items: OrderItem[],
    public totalAmount: number,
    public orderDate: Date,
    public shippingAddress: {
      address: string;
      city: string;
      country: string;
      phoneNumber: number;
      userName: string;
    },
    public paymentMethod: string,
    public paymentStatus: string
  ) {}
}
