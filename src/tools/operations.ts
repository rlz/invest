import { Operation } from "../api/common";

export function opQuantity (op: Operation): number | undefined {
  if (op.trades !== undefined) {
    return op.trades.map(t => t.quantity).reduce((p, c) => p + c, 0);
  }

  return op.quantity;
}