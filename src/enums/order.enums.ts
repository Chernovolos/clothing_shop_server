export enum OrderStatus {
  NEW = 0,
  PROCESSING = 1,
  SHIPPED = 2,
  DELIVERED = 3,
  COMPLETED = 4,
  CANCELED = 5,
  REFUNDED = 6,
}

export enum OrderItemType {
  PRODUCT = 0,
  DELIVERY = 1,
}

export enum OrderPaymentType {
  CARD = 0,
  CASH = 1,
}
