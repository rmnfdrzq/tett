"use client";

import { useState } from "react";
import type { CheckoutFormValues } from "@/lib/checkout/validation";
import { CartTable } from "./cart/cart-table";
import { CheckoutForm, initialCheckoutValues } from "./checkout/checkout-form";
import { BrowserBar } from "./header";
import dynamic from "next/dynamic";

// dnd-kit генерирует много событий и состояний, которые сложно синхронизировать между сервером и клиентом, 
// что привело к рассинхронизации при гидратации. 
// Поэтому решил отключить SSR для компонентов, использующих dnd-kit. 
// Это в данном случаене проблема, так как дизайн не содержит критически важного контента 
// для SEO и может быть отложен до загрузки клиента без ревльного влияния на UX. 
// Временная анимация заполнителя сохраняет визуальную целостность страницы во время загрузки компонента на клиенте
const DesignTool = dynamic(
  () => import("./design-tool/design-tool").then((m) => ({ default: m.DesignTool })),
  {
    ssr: false,
    loading: () => (
      <div className="design-tool-container animate-pulse" aria-hidden />
    ),
  },
);
import { OrderSummary } from "./order-summary";
import { TilePreview } from "../ui/tile-preview";
import { LeftDecoration } from "../decorations/left-decoration";
import { RightDecoration } from "../decorations/right-decoration";
import { TopLeftDecoration } from "../decorations/top-left-decoration";
import { TopRightDecoration } from "../decorations/top-right-decoration";
import { BottomLeftDecoration } from "../decorations/bottom-left-decoration";
import { BottomRightDecoration } from "../decorations/bottom-right-decoration";

export function OrderPage() {
  const [checkoutValues, setCheckoutValues] = useState<CheckoutFormValues>(
    initialCheckoutValues,
  );

  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-paper text-ink font-sans antialiased">
      <DesktopOrderPage
        checkoutValues={checkoutValues}
        onCheckoutValuesChange={setCheckoutValues}
      />
      <MobileOrderPage onCheckoutValuesChange={setCheckoutValues} />
    </main>
  );
}

function DesktopOrderPage({
  checkoutValues,
  onCheckoutValuesChange,
}: {
  checkoutValues: CheckoutFormValues;
  onCheckoutValuesChange: (values: CheckoutFormValues) => void;
}) {
  return (
    <div className="desktop-order-page">
      <BrowserBar />
      <div className="paper-texture relative flex-1 w-full overflow-y-auto mt-9 flex flex-col">
        <div className="absolute top-0 left-0 pointer-events-none z-0 h-[200px] aspect-[1332/942]">
          <TopLeftDecoration />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none z-0 h-[200px] aspect-[862/610]">
          <TopRightDecoration />
        </div>

        <div className="absolute bottom-0 left-0 pointer-events-none z-0 h-[200px] aspect-[1622/740]">
          <BottomLeftDecoration />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none z-0 h-[200px] aspect-[1446/664]">
          <BottomRightDecoration />
        </div>

        {/* Враппер */}
        <div className="desktop-content-wrapper flex flex-col">
          <PageTitle desktop />

          <div className="desktop-grid-layout">
            <section className="flex min-w-0 flex-col gap-2 col-cart">
              <CartTable />
            </section>

            <section className="flex min-w-0 flex-col gap-2 pt-7 col-design">
              <DesignTool />
            </section>

            <section className="flex min-w-0 flex-col gap-2 col-summary">
              {/* Шапка */}
              <div className="flex relative">
                <h2 className="order-summary-title">
                  <span className="order-summary-title-text">
                    Order Summary
                  </span>
                </h2>
                <div className="flex-1 border-b-2 border-ink bg-tab" />
              </div>

              <div className="px-3 space-y-4">
                <OrderSummary
                  values={checkoutValues}
                  hideHeader
                  onValuesChange={(v) =>
                    onCheckoutValuesChange({ ...checkoutValues, ...v })
                  }
                />
                <CheckoutForm
                  mode="desktop"
                  onValuesChange={onCheckoutValuesChange}
                />
              </div>
            </section>
          </div>

          {/* Блок чотбы опустить футер вниз */}
          <div className="flex-1" />

          {/* Футер */}
          <footer className="font-hand relative z-10 pb-6 text-center text-sm leading-relaxed uppercase whitespace-nowrap">
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              <span className="max-[1325px]:hidden">Terms of Service</span>
              <span className="hidden max-[1325px]:inline">Terms</span>
            </button>
            <span className="px-1.5 text-ink/60">|</span>
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              <span className="max-[1325px]:hidden">Privacy Policy</span>
              <span className="hidden max-[1325px]:inline">Privacy</span>
            </button>
            <span className="px-1.5 text-ink/60">|</span>
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              <span className="max-[1325px]:hidden">Shipping Info</span>
              <span className="hidden max-[1325px]:inline">Shipping</span>
            </button>
            <span className="px-1.5 text-ink/60">|</span>
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              <span className="max-[1325px]:hidden">Contact Us</span>
              <span className="hidden max-[1325px]:inline">Contact</span>
            </button>
            <br />
            <span className="normal-case opacity-90">
              © 2026 The Artisan Kiln. All Rights Reserved.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

// Мобильная версия страницы
function MobileOrderPage({
  onCheckoutValuesChange,
}: {
  onCheckoutValuesChange: (values: CheckoutFormValues) => void;
}) {
  return (
    <div className="mobile-order-page">
      <BrowserBar compact />
      <div className="mobile-content-box">
        <div className="absolute top-0 left-0 pointer-events-none z-0 w-[24vw] max-w-[283px] aspect-[1332/942]">
          <TopLeftDecoration />
        </div>
        <div className="absolute top-0 right-0 pointer-events-none z-0 w-[24vw] max-w-[283px] aspect-[862/610]">
          <TopRightDecoration />
        </div>

        {/* Враппер */}
        <div className="relative z-10 mx-auto max-w-[560px] px-4 pb-16 w-full flex flex-col min-h-full">
          <PageTitle />

          <div className="relative z-10 mt-8 pb-16">
            <CheckoutForm mode="mobile" onValuesChange={onCheckoutValuesChange}>
              <CartTable compact />
            </CheckoutForm>
          </div>

          <div className="absolute bottom-0 left-0 pointer-events-none z-0 w-[36vw] max-w-[438px] aspect-[1622/740]">
            <BottomLeftDecoration />
          </div>
          <div className="absolute bottom-0 right-0 pointer-events-none z-0 w-[36vw] max-w-[434px] aspect-[1446/664]">
            <BottomRightDecoration />
          </div>

          <footer className="font-hand absolute bottom-16 left-0 right-0 z-10 text-center text-base leading-relaxed uppercase flex items-center justify-center gap-6">
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              Terms
            </button>
            <button
              type="button"
              className="hover:text-navy-light transition-colors cursor-pointer outline-none"
            >
              Contact
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

function PageTitle({ desktop = false }: { desktop?: boolean }) {
  const leftHeight = desktop ? 72 : 84;
  const leftWidth = Math.round(leftHeight * (207.84 / 245.24));
  const rightHeight = desktop ? 72 : 84;
  const rightWidth = Math.round(rightHeight * (219.32 / 234.33));

  return (
    <section
      className={`font-hand relative top-[8px] z-10 mx-auto flex flex-col items-center text-center ${
        desktop ? "mt-4" : "mt-0"
      }`}
    >
      <div className="w-fit flex items-center">
        {desktop && <LeftDecoration width={leftWidth} height={leftHeight} />}
        <div
          className={`${desktop ? "px-6" : "px-2"} min-w-max flex flex-col items-center`}
        >
          <h1 className={desktop ? "page-title-desktop" : "page-title-mobile"}>
            Ceramic Tile Order Form
          </h1>
          <div className="mt-1 flex items-center justify-center gap-1 whitespace-nowrap">
            <TilePreview tileId="tile2" size={desktop ? "sm" : "xs"} />
            <TilePreview tileId="tile10" size={desktop ? "sm" : "xs"} />
            <TilePreview tileId="tile9" size={desktop ? "sm" : "xs"} />
            <p
              className={`${desktop ? "page-subtitle-desktop" : "page-subtitle-mobile"} mx-[14px]`}
            >
              The Artisan Kiln
            </p>
            <TilePreview tileId="tile11" size={desktop ? "sm" : "xs"} />
            <TilePreview tileId="tile6" size={desktop ? "sm" : "xs"} />
            <TilePreview tileId="tile7" size={desktop ? "sm" : "xs"} />
          </div>
        </div>
        {desktop && <RightDecoration width={rightWidth} height={rightHeight} />}
      </div>
    </section>
  );
}
