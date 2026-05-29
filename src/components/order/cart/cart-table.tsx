"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type React from "react";
import { decrementQuantity, incrementQuantity, removeItem, setQuantity } from "@/lib/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartItems, selectGrandTotal, selectShipping, selectSubtotal } from "@/lib/store/selectors";
import { formatCurrency } from "@/lib/cart/calculations";
import { TilePreview } from "../../ui/tile-preview";
import { AddTilesToCartDropdown } from "../add-tiles-modal";

type CartTableProps = {
  compact?: boolean;
};

export function CartTable({ compact = false }: CartTableProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectSubtotal);
  const shipping = useAppSelector(selectShipping);
  const grandTotal = useAppSelector(selectGrandTotal);
  const reducedMotion = useReducedMotion();

  return (
    <section>
      {!compact ? (
        <h2 className="cart-title">Shopping Cart & Design Tool</h2>
      ) : null}
      <div className={compact ? "cart-table-box bg-paper/65" : "cart-table-box"}>
        <table className="cart-items-table w-full border-collapse text-center table-fixed">
          <thead>
            <tr className={compact ? "cart-header-row-mobile" : "cart-header-row-desktop"}>
              <Th className="cart-col-collection">Tile Collection</Th>
              <Th className="cart-col-eq">Item</Th>
              <Th className="cart-col-eq cart-col-tight-spacing">Quantity<br />(sq. ft.)</Th>
              <Th className="cart-col-eq cart-col-tight-spacing">Unit Price<br />($)</Th>
              <Th className="cart-col-actions">Actions</Th>
            </tr>
          </thead>
          <AnimatePresence initial={false} mode="popLayout">
            <tbody>
              {items.map((item) => (
                <motion.tr
                  key={item.id}
                  layout={!reducedMotion}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reducedMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.16 }}
                  className="bg-paper/40"
                >
                  <Td className="cart-col-collection">
                    <TilePreview tileId={item.id} size="collection" label />
                  </Td>
                  <Td className="cart-col-eq">
                    <TilePreview tileId={item.id} size="item" />
                  </Td>
                  <Td className="cart-col-eq cart-col-tight-spacing">
                    <QuantityControl
                      value={item.quantity}
                      onChange={(quantity) => dispatch(setQuantity({ id: item.id, quantity }))}
                      compact={compact}
                    />
                  </Td>
                  <Td className="cart-col-eq cart-col-tight-spacing">
                    <span className={compact ? "cart-price-mobile" : "cart-price-desktop"}>
                      {formatCurrency(item.unitPrice)}
                    </span>
                  </Td>
                  <Td className="cart-col-actions">
                    <div className="flex flex-col items-center justify-start gap-1 py-1">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => dispatch(incrementQuantity(item.id))}
                          className="ink-border flex items-center justify-center h-5 w-6 text-[13px] font-bold leading-none transition-transform active:scale-95 bg-teal text-ink cursor-pointer"
                          aria-label="Add"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => dispatch(decrementQuantity(item.id))}
                          className="ink-border flex items-center justify-center h-5 w-6 text-[13px] font-bold leading-none transition-transform active:scale-95 bg-terracotta text-paper cursor-pointer"
                          aria-label="Remove"
                        >
                          -
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => dispatch(removeItem(item.id))}
                        className="group flex items-center justify-center gap-1 cursor-pointer mt-3 hover:scale-105 transition-transform active:scale-95"
                        aria-label="Delete item"
                      >
                        <svg
                          className="h-4 w-4 text-ink"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />
                        </svg>
                        <span className="font-hand text-[10px] leading-none uppercase">delete</span>
                      </button>
                    </div>
                  </Td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
        <div className="cart-summary-area bg-paper/40 h-auto">
          <div className="cart-summary-add">
            <AddTilesToCartDropdown />
          </div>
          <div className="cart-summary-labels">
            <div className="flex items-center justify-end h-5 uppercase text-ink text-[11px] leading-none">Subtotal:</div>
            <div className="flex items-center justify-end h-5 uppercase text-ink text-[11px] leading-none">Shipping:</div>
            <div className="flex items-center justify-end h-5 uppercase text-ink text-[11px] leading-none">Grand Total:</div>
          </div>
          <div className="cart-summary-values">
            <div className="bracket-box cart-summary-value bg-paper text-xs">
              {formatCurrency(subtotal)}
            </div>
            <div className="bracket-box cart-summary-value bg-paper text-xs">
              {formatCurrency(shipping)}
            </div>
            <div className="bracket-box cart-summary-value bg-paper-muted text-xs">
              {formatCurrency(grandTotal)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



function QuantityControl({
  value,
  onChange,
  compact = false,
}: {
  value: number;
  onChange: (value: number) => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "quantity-display-mobile" : "quantity-display-desktop"}>
      <input
        aria-label="Quantity"
        value={value}
        inputMode="numeric"
        onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")))}
        className="quantity-input"
      />
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`border-b-2 border-r-2 border-ink px-1 py-2 last:border-r-0 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`border-b-2 border-r-2 border-ink px-1 py-[3px] last:border-r-0 ${className}`}>{children}</td>;
}
