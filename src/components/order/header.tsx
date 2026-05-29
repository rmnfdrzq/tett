"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectCartItems } from "@/lib/store/selectors";

export function BrowserBar({ compact = false }: { compact?: boolean }) {
  const navItems = compact
    ? ["SHOP", "COLLECTIONS", "ABOUT US"]
    : ["HOME", "SHOP", "COLLECTIONS", "ABOUT US", "FAQ", "GALLERY", "BLOG"];

  const nav = (
    <nav className={`font-hand flex leading-[1.4] ${
      compact ? "justify-start gap-2.5 pl-1 text-[13px]" : "justify-center gap-5 text-[17px]"
    }`}>
      {navItems.map((item) => (
        <span key={item} className="cursor-pointer hover:text-navy-light transition-colors" style={{ letterSpacing: "-0.2px" }}>
          {item}
        </span>
      ))}
    </nav>
  );

  const actions = (
    <div className={`font-hand flex items-center justify-end ${
      compact ? "shrink-0 gap-1.5" : "flex-1 gap-2.5 text-sm"
    }`}>
      <CartIcon compact={compact} />
      <UserPic compact={compact} />
      <span className={`rounded-md border-2 border-ink bg-navy-light text-paper cursor-pointer hover:bg-navy transition-colors leading-none flex items-center justify-center ${
        compact ? "h-[25px] px-2 text-[11px]" : "h-7 px-3 text-[13px]"
      }`}>
        {compact ? "Log In" : "A. Smith"}
      </span>
    </div>
  );

  return (
    <div className={`fixed left-0 right-0 top-0 z-50 flex items-center bg-header-bar border-b-2 border-ink ${
      compact ? "h-8 justify-between px-2" : "h-9 justify-between px-5"
    }`}>
      {compact ? (
        <>
          {nav}
          {actions}
        </>
      ) : (
        <>
          <div className="flex-1" />
          {nav}
          {actions}
        </>
      )}
    </div>
  );
}

function CartIcon({ compact = false }: { compact?: boolean }) {
  const items = useAppSelector(selectCartItems);
  const count = items.length;

  return (
    <div className="relative inline-flex">
      <svg className={`${compact ? "h-[25px] w-[25px]" : "h-8 w-8"} stroke-ink`} viewBox="0 0 40 40" aria-label={`Cart, ${count} item${count !== 1 ? "s" : ""}`}>
        <path d="M4 6h5l4 20h17l4-13H12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <circle cx="16" cy="33" r="3" className="fill-cart-wheel stroke-ink" strokeWidth="3" />
        <circle cx="30" cy="33" r="3" className="fill-cart-wheel stroke-ink" strokeWidth="3" />
      </svg>

      {count > 0 && (
        <span className={compact ? "cart-badge-compact" : "cart-badge"}>
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
}

function UserPic({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`grid place-items-center rounded-full border-2 border-ink bg-navy-light ${compact ? "h-[25px] w-[25px]" : "h-8 w-8"}`} aria-hidden>
      <svg className={`${compact ? "h-4 w-4" : "h-5 w-5"} stroke-ink`} viewBox="0 0 32 32">
        <circle cx="16" cy="11" r="5" className="fill-paper stroke-ink" strokeWidth="2" />
        <path d="M6 28c1.6-6 5-9 10-9s8.4 3 10 9" className="fill-paper stroke-ink" strokeLinecap="round" strokeWidth="2" />
      </svg>
    </span>
  );
}
