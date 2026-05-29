"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCartItems } from "@/lib/store/selectors";
import { PaletteTile } from "./PaletteTile";

export function DesignPalette() {
  const cartItems = useAppSelector(selectCartItems);

  return (
    <div
      className="h-full flex flex-col min-w-0 overflow-hidden"
      aria-label="Design palette"
    >
      <h3 className="design-tool-palette-title flex items-center justify-center h-[42px] shrink-0">
        Design Palette
      </h3>

      <div className="palette-scroll overflow-y-auto flex-1">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-8 opacity-40 px-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
              Add tiles<br />to cart
            </span>
          </div>
        ) : (
          <div className="palette-tiles-grid">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="palette-tile-wrapper"
                >
                  <PaletteTile tileId={item.id} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
