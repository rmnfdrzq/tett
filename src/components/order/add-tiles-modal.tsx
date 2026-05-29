"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TILE_DEFINITIONS, type TileId } from "@/lib/tiles";
import { addItem } from "@/lib/store/cart-slice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectCartItems } from "@/lib/store/selectors";
import { formatCurrency } from "@/lib/cart/calculations";

export function AddTilesToCartDropdown() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const inCart = new Set(cartItems.map((i) => i.id));
  const modalRef = useRef<HTMLDivElement>(null);

  // Закрытие по Escape, блокировка скролла и blur фона при открытом модальном окне
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("modal-open");

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleAdd(id: TileId) {
    dispatch(addItem(id));
  }

  const modal = open ? (
    <div
      className="tile-modal-backdrop"
      onPointerDown={(e) => {
        // Закрытие при клике вне панели
        if (e.target === e.currentTarget) setOpen(false);
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Full Range — choose a tile to add"
    >
      <div ref={modalRef} className="tile-modal-panel">
        <div className="tile-modal-header">
          <span className="tile-modal-title">Full Range</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="tile-modal-close"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="tile-modal-body">
          <table className="add-tile-table">
            <thead>
              <tr className="add-tile-table-head">
                <th className="add-tile-th add-tile-col-img">Image</th>
                <th className="add-tile-th add-tile-col-name">Name</th>
                <th className="add-tile-th add-tile-col-price">Price&nbsp;/ sq.ft</th>
                <th className="add-tile-th add-tile-col-action">Add to cart</th>
              </tr>
            </thead>
            <tbody>
              {TILE_DEFINITIONS.map((tile) => {
                const added = inCart.has(tile.id);
                return (
                  <tr key={tile.id} className={`add-tile-row${added ? " add-tile-row--in-cart" : ""}`}>
                    <td className="add-tile-td add-tile-col-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tile.imageSrc} alt={tile.name} className="add-tile-img" />
                    </td>
                    <td className="add-tile-td add-tile-col-name">
                      <span className="add-tile-name">{tile.name}</span>
                    </td>
                    <td className="add-tile-td add-tile-col-price">
                      {formatCurrency(tile.unitPrice)}
                    </td>
                    <td className="add-tile-td add-tile-col-action">
                      {added ? (
                        <span className="add-tile-badge">In cart</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAdd(tile.id as TileId)}
                          className="add-tile-btn"
                          aria-label={`Add ${tile.name} to cart`}
                        >
                          +
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative flex justify-start">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex h-11 items-center justify-center gap-1.5 sm:gap-2 bg-paper-muted hover:bg-paper-hover active:scale-95 transition-all duration-150 rounded-md px-3 sm:px-5 cursor-pointer min-w-[135px] sm:min-w-[155px] relative left-[47px] sm:left-[67px] top-[-4px]"
      >
        <span className="text-[18px] sm:text-[20px] font-bold leading-none text-ink select-none">+</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tiles/Ivory_Weave.png"
          alt=""
          aria-hidden="true"
          className="h-6 w-6 object-cover rounded-sm border border-ink/30 select-none"
        />
        <div className="flex flex-col tracking-tight font-sans font-black text-[9px] sm:text-[10px] leading-tight text-left text-ink uppercase">
          <span className="whitespace-nowrap">Add New Tile</span>
          <span className="whitespace-nowrap">To Cart</span>
        </div>
      </button>
      {typeof window !== "undefined" && modal
        ? createPortal(modal, document.body)
        : null}
    </div>
  );
}
