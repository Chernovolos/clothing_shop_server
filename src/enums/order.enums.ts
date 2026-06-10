export enum OrderStatus {
  PENDING_PAYMENT = 0,
  NEW = 1,
  PROCESSING = 2,
  SHIPPED = 3,
  DELIVERED = 4,
  COMPLETED = 5,
  CANCELED = 6,
  REFUNDED = 7,
}

export enum OrderItemType {
  PRODUCT = 0,
  DELIVERY = 1,
}
