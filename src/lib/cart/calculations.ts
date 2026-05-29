import type { CartItem } from "@/lib/tiles";

export const SHIPPING_PRICE = 25;
export const FREE_SHIPPING_THRESHOLD = 500;

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}

export function calculateShipping(subtotal: number): number {
  if (subtotal === 0) return 0;
  return subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_PRICE;
}

export function calculateGrandTotal(subtotal: number): number {
  return subtotal + calculateShipping(subtotal);
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}
