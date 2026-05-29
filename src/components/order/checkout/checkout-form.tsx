"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import {
  type CheckoutErrors,
  type CheckoutFormValues,
  type PaymentMethod,
  validateCheckout,
} from "@/lib/checkout/validation";

// Нигде не используется, но сделан для демонстрации
const paymentMethods: { id: PaymentMethod; label: string; mark: string }[] = [
  { id: "card", label: "Credit/Debit Card", mark: "VISA" },
  { id: "paypal", label: "PayPal", mark: "P" },
  { id: "apple-pay", label: "Apple Pay", mark: "Pay" },
  { id: "bank-transfer", label: "Bank Transfer", mark: "BANK" },
];

const initialValues: CheckoutFormValues = {
  customerName: "",
  phone: "",
  email: "",
  shippingAddress: "",
  projectNotes: "",
  paymentMethod: "card",
  cardNumber: "",
  expiration: "",
  cvv: "",
};

type CheckoutFormProps = {
  mode: "desktop" | "mobile";
  onValuesChange?: (values: CheckoutFormValues) => void;
  children?: React.ReactNode;
};

export function CheckoutForm({ mode, onValuesChange, children }: CheckoutFormProps) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Set<keyof CheckoutFormValues>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const reducedMotion = useReducedMotion();
  const validation = validateCheckout(values);
  const visibleErrors = getVisibleErrors(validation.errors, touched, submitted);

  function formatExpiration(value: string): string {
    // Удалить все, кроме цифр
    const digits = value.replace(/\D/g, '');
    // Ограничить до 4 цифр
    const limited = digits.slice(0, 4);
    // Добавить слэш после 2 цифр, если есть больше 2
    if (limited.length >= 3) {
      return `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    return limited;
  }

  function formatCardNumber(value: string): string {
    // Удалить все, кроме цифр
    const digits = value.replace(/\D/g, '');
    // Ограничить до 16 цифр
    const limited = digits.slice(0, 16);
    // Добавить пробел после каждого 4 символов
    const groups = limited.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }

  function formatPhone(value: string): string {
    // Сохранить + в начале, если он есть, и удалить все остальные нецифровые символы
    const hasPlus = value.startsWith('+');
    // Удалить все, кроме цифр
    const digits = value.replace(/\D/g, '');
    // Ограничить до 15 цифр (макс для международного формата)
    return hasPlus ? `+${digits}` : digits;
  }

  function formatEmail(value: string): string {
    // Удалить пробелы и привести к нижнему регистру
    return value.replace(/\s/g, '').toLowerCase();
  }

  function updateField<K extends keyof CheckoutFormValues>(field: K, value: CheckoutFormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    onValuesChange?.(next);
  }

  function markTouched(field: keyof CheckoutFormValues) {
    setTouched((current) => new Set(current).add(field));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    if (!validation.valid) {
      setStatus("Please fix the highlighted fields.");
      return;
    }

    setStatus("Order ready for secure processing.");
  }

  return (
    <form onSubmit={submit} noValidate className="font-hand w-full max-w-full">
      {mode === "mobile" ? (
        <>
          <div className="checkout-mobile-contact-fields">
            <TextField id="customerName" label="Customer Name" value={values.customerName} error={visibleErrors.customerName} onChange={(value) => updateField("customerName", value)} onBlur={() => markTouched("customerName")} />
            <div className="grid grid-cols-2 gap-4">
              <TextField id="phone" label="Phone" value={values.phone} error={visibleErrors.phone} onChange={(value) => updateField("phone", formatPhone(value))} onBlur={() => markTouched("phone")} />
              <TextField id="email" label="Email" value={values.email} error={visibleErrors.email} onChange={(value) => updateField("email", formatEmail(value))} onBlur={() => markTouched("email")} />
            </div>
            <TextField id="shippingAddress" label="Shipping Address" value={values.shippingAddress} error={visibleErrors.shippingAddress} onChange={(value) => updateField("shippingAddress", value)} onBlur={() => markTouched("shippingAddress")} />
          </div>
          <hr className="checkout-mobile-divider" />
        </>
      ) : null}

      {children}

      <fieldset className={`${mode === "mobile" ? "mt-3" : "mt-4"} m-0 p-0 border-none w-full max-w-full`}>
        <legend className="checkout-legend">
          Select Payment Method:
        </legend>
        
        {mode === "mobile" ? (
          /* Мобильный горизонтальный лейаут */
          <div className="checkout-pay-mobile-row">
            {/* Card */}
            <label
              className={`checkout-pay-card-mobile ${
                values.paymentMethod === "card" ? "bg-mustard/20 font-bold" : "hover:bg-cream/40"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={values.paymentMethod === "card"}
                onChange={() => updateField("paymentMethod", "card")}
                className="sr-only"
              />
              <span className="grid h-5 w-5 rounded-full border-2 border-ink place-items-center bg-paper mb-2">
                {values.paymentMethod === "card" ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
              </span>
              <span className="ink-border rounded bg-cream px-1 py-0.5 mb-2"><CreditCardIcon className="h-6 w-8 text-ink" /></span>
              <span className="checkout-pay-label-mobile">CREDIT/DEBIT<br />CARD</span>
            </label>

            {/* PayPal */}
            <label
              className={`checkout-pay-card-mobile ${
                values.paymentMethod === "paypal" ? "bg-mustard/20 font-bold" : "hover:bg-cream/40"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={values.paymentMethod === "paypal"}
                onChange={() => updateField("paymentMethod", "paypal")}
                className="sr-only"
              />
              <span className="grid h-5 w-5 rounded-full border-2 border-ink place-items-center bg-paper mb-2">
                {values.paymentMethod === "paypal" ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
              </span>
              <span className="ink-border rounded bg-cream px-1 py-0.5 mb-2"><PaypalLogo className="h-6 w-6 text-paypal-blue" /></span>
              <span className="checkout-pay-label-mobile">PAYPAL</span>
            </label>

            {/* Apple Pay */}
            <label
              className={`checkout-pay-card-mobile group ${
                values.paymentMethod === "apple-pay"
                  ? "bg-mustard/20 font-bold hover:bg-paper-hover"
                  : "hover:bg-paper-hover"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={values.paymentMethod === "apple-pay"}
                onChange={() => updateField("paymentMethod", "apple-pay")}
                className="sr-only"
              />
              <span className="grid h-5 w-5 rounded-full border-2 border-ink place-items-center bg-paper group-hover:bg-paper-hover mb-2">
                {values.paymentMethod === "apple-pay" ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
              </span>
              <span className="ink-border rounded bg-cream px-1 py-0.5 mb-2"><ApplePayLogo className="h-6 w-10 text-ink" /></span>
              <span className="checkout-pay-label-mobile">APPLE PAY</span>
            </label>

            {/* Bank Transfer */}
            <label
              className={`checkout-pay-card-mobile group ${
                values.paymentMethod === "bank-transfer"
                  ? "bg-mustard/20 font-bold hover:bg-paper-hover"
                  : "hover:bg-paper-hover"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={values.paymentMethod === "bank-transfer"}
                onChange={() => updateField("paymentMethod", "bank-transfer")}
                className="sr-only"
              />
              <span className="grid h-5 w-5 rounded-full border-2 border-ink place-items-center bg-paper group-hover:bg-paper-hover mb-2">
                {values.paymentMethod === "bank-transfer" ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
              </span>
              <span className="ink-border rounded bg-cream px-1 py-0.5 mb-2"><BankIcon className="h-6 w-7 text-ink" /></span>
              <span className="checkout-pay-label-mobile">BANK TRANSFER</span>
            </label>
          </div>
        ) : (
          <div className="space-y-3 mt-2 w-full">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-1.5 w-full">
              <label className="checkout-pay-method-desktop">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={values.paymentMethod === "card"}
                  onChange={() => updateField("paymentMethod", "card")}
                  className="sr-only"
                />
                <span className="grid h-4 w-4 rounded-full border-2 border-ink place-items-center bg-paper">
                  {values.paymentMethod === "card" ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
                </span>
                <span className="font-bold text-[13px] tracking-tight">CREDIT/DEBIT CARD</span>
              </label>
              
              <label className="checkout-pay-method-desktop">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={values.paymentMethod === "paypal"}
                  onChange={() => updateField("paymentMethod", "paypal")}
                  className="sr-only"
                />
                <span className="grid h-4 w-4 rounded-full border-2 border-ink place-items-center bg-paper">
                  {values.paymentMethod === "paypal" ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
                </span>
                <span className="flex items-center gap-1.5">
                  <PaypalLogo className="h-5 w-5 text-paypal-blue" />
                  <span className="font-bold text-[13px] text-paypal-blue">PAYPAL</span>
                </span>
              </label>
            </div>

            {/* Десктопная форма карты */}
            <AnimatePresence initial={false}>
              {values.paymentMethod === "card" ? (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="checkout-card-box w-full"
                >
                  <div className="flex items-center gap-2">
                    <span className="ink-border rounded bg-white px-1.5 py-0.5 inline-flex items-center justify-center h-5 select-none"><span className="italic font-bold text-visa-blue text-[11px] leading-none">VISA</span></span>
                    <span className="ink-border rounded bg-white px-1.5 py-0.5 inline-flex items-center justify-center h-5"><MastercardLogo className="h-3 w-6" /></span>
                  </div>
                  <TextField id="cardNumber" label="Card Number" value={values.cardNumber} error={visibleErrors.cardNumber} onChange={(value) => updateField("cardNumber", formatCardNumber(value))} onBlur={() => markTouched("cardNumber")} boxed placeholder="1234 4556 7723 8990" />
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <TextField id="expiration" label="Expiration" value={values.expiration} error={visibleErrors.expiration} onChange={(value) => updateField("expiration", formatExpiration(value))} onBlur={() => markTouched("expiration")} boxed placeholder="EXPIRATION" hideLabel />
                    <TextField id="cvv" label="CVV" value={values.cvv} error={visibleErrors.cvv} onChange={(value) => updateField("cvv", value)} onBlur={() => markTouched("cvv")} boxed placeholder="CVV" hideLabel />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label
                className={`checkout-pay-card-desktop group ${
                  values.paymentMethod === "apple-pay"
                    ? "bg-mustard/20 shadow-ink font-bold hover:bg-paper-hover"
                    : "bg-paper/50 hover:bg-paper-hover"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={values.paymentMethod === "apple-pay"}
                  onChange={() => updateField("paymentMethod", "apple-pay")}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 w-full h-full">
                  <span className="grid h-4 w-4 rounded-full border-2 border-ink place-items-center bg-paper group-hover:bg-paper-hover shrink-0 relative -translate-y-[5px]">
                    {values.paymentMethod === "apple-pay" ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
                  </span>
                  <div className="flex flex-col items-center justify-center flex-1 gap-1">
                    <ApplePayLogo className="h-7 w-16 text-ink" />
                    <span className="checkout-pay-card-title text-center">APPLE PAY</span>
                  </div>
                </div>
              </label>

              <label
                className={`checkout-pay-card-desktop group ${
                  values.paymentMethod === "bank-transfer"
                    ? "bg-mustard/20 shadow-ink font-bold hover:bg-paper-hover"
                    : "bg-paper/50 hover:bg-paper-hover"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={values.paymentMethod === "bank-transfer"}
                  onChange={() => updateField("paymentMethod", "bank-transfer")}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 w-full h-full">
                  <span className="grid h-4 w-4 rounded-full border-2 border-ink place-items-center bg-paper group-hover:bg-paper-hover shrink-0 relative -translate-y-[5px]">
                    {values.paymentMethod === "bank-transfer" ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
                  </span>
                  <div className="flex flex-col items-center justify-center flex-1 gap-1">
                    <BankIcon className="h-7 w-8 text-ink" />
                    <span className="checkout-pay-card-title text-center text-[10px] leading-[12px]">BANK TRANSFER</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}
      </fieldset>

      {/* Мобильная форма карты */}
      {values.paymentMethod === "card" && mode === "mobile" ? (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="checkout-mobile-card-details w-full"
        >
          <div className="flex items-center gap-2">
            <span className="ink-border rounded bg-white px-2 py-1 inline-flex items-center justify-center h-8 select-none"><span className="italic font-bold text-visa-blue text-[15px] leading-none">VISA</span></span>
            <span className="ink-border rounded bg-white px-2 py-1 inline-flex items-center justify-center h-8"><MastercardLogo className="h-6 w-10" /></span>
          </div>
          <TextField id="cardNumber" label="Card Number" value={values.cardNumber} error={visibleErrors.cardNumber} onChange={(value) => updateField("cardNumber", formatCardNumber(value))} onBlur={() => markTouched("cardNumber")} />
          <div className="grid grid-cols-2 gap-4">
            <TextField id="expiration" label="Expiration" value={values.expiration} error={visibleErrors.expiration} onChange={(value) => updateField("expiration", formatExpiration(value))} onBlur={() => markTouched("expiration")} />
            <TextField id="cvv" label="CVV" value={values.cvv} error={visibleErrors.cvv} onChange={(value) => updateField("cvv", value)} onBlur={() => markTouched("cvv")} />
          </div>
        </motion.div>
      ) : null}

      {mode === "mobile" ? (
        <TextField
          id="projectNotes"
          label="Project Name / Notes"
          value={values.projectNotes}
          error={visibleErrors.projectNotes}
          onChange={(value) => updateField("projectNotes", value)}
          onBlur={() => markTouched("projectNotes")}
          className="checkout-notes-field"
        />
      ) : null}

      {mode === "desktop" ? (
        <button
          type="submit"
          className="checkout-submit-btn"
        >
          PLACE SECURE ORDER
        </button>
      ) : null}
      <p className="sr-only" aria-live="polite">{status}</p>
      {status ? <p className="mt-2 text-center text-base leading-none font-bold">{status}</p> : null}
    </form>
  );
}

export { initialValues as initialCheckoutValues };

function getVisibleErrors(
  errors: CheckoutErrors,
  touched: Set<keyof CheckoutFormValues>,
  submitted: boolean,
): CheckoutErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => submitted || touched.has(field as keyof CheckoutFormValues)),
  ) as CheckoutErrors;
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  onBlur,
  boxed = false,
  className = "",
  placeholder = "",
  hideLabel = false,
}: {
  id: keyof CheckoutFormValues;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  boxed?: boolean;
  className?: string;
  placeholder?: string;
  hideLabel?: boolean;
}) {
  const field = (
    <>
      {!hideLabel && <span className="shrink-0 uppercase text-xs">{label}: </span>}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={
          boxed
            ? "ink-border mt-1 h-8 w-full rounded bg-white px-2 font-sans text-xs outline-none focus:bg-white placeholder:text-xs placeholder:text-muted placeholder:uppercase"
            : "min-w-0 flex-1 border-b-2 border-ink bg-transparent px-2 font-sans text-base outline-none focus:bg-paper/60"
        }
      />
    </>
  );

  return (
    <label className={`block ${className}`}>
      {boxed ? field : <div className="flex min-w-0 items-end gap-1">{field}</div>}
      {error ? <span id={`${id}-error`} className="block font-sans text-xs font-bold text-terracotta">{error}</span> : null}
    </label>
  );
}

function MastercardLogo({ className = "h-4 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 16" fill="none">
      <circle cx="7" cy="8" r="7" className="fill-mastercard-red" />
      <circle cx="15" cy="8" r="7" className="fill-mastercard-orange opacity-85" />
    </svg>
  );
}

function PaypalLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 28" fill="currentColor">
      <path d="M16.5 7.5c0 3.7-3 6.7-6.7 6.7H6.5v8.5c0 .5-.4 1-1 1H1c-.5 0-1-.5-.9-1l3-18.5c.1-.5.6-1 1.1-1h6.6c3.7 0 6.7 3 6.7 6.7z" className="fill-paypal-blue-light" />
      <path d="M19.5 9.5c0 3.7-3 6.7-6.7 6.7H9.5V26c0 .5-.4 1-1 1H4.1c-.5 0-1-.5-.9-1l3-18.5c.1-.5.6-1 1.1-1h6.6c3.7 0 6.7 3 6.7 6.7z" className="fill-paypal-blue opacity-85" />
    </svg>
  );
}

function ApplePayLogo({ className = "h-6 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="-3 0 51 20" fill="currentColor">
      <path d="M12.5 13.5c-.3 0-.8-.3-1.1-.5-.5-.4-.9-1.2-.9-2.3 0-1.3.6-2.1 1.4-2.1.4 0 .8.2 1.1.5.1-.4.4-.9.9-1.1.2-.1.5-.2.8-.2.2 0 .4.1.6.2.3.2.6.6.6 1.2 0 1.2-.6 2.1-1.4 2.1-.4 0-.8-.2-1-.5-.2.4-.6.7-1 .7zm.5-7.3c-.6 0-1.1.4-1.2.9.4 0 .9-.3 1.1-.7.1-.1.1-.1.1-.2z" className="hidden" />
      <path d="M8 12c0-2.2 1.8-3.5 1.9-3.6-.9-1.4-2.5-1.5-3-1.6-1.3-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.7-1.4.1-2.8.9-3.5 2.1-1.4 2.5-.4 6.2 1 8.2.7 1 1.5 2.1 2.6 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.3 1.1-2.3-0.1 0-2.3-.9-2.3-3.3z" transform="translate(1, 0) scale(0.95)" />
      <path d="M5.5 6.2c.6-.7 1-1.7.9-2.7-.9.1-2 0-2.6.7-.5.6-1 1.6-.9 2.6.9.1 1.9-.1 2.6-.7z" transform="translate(1, 0) scale(0.95)" />
      <text x="18" y="15" className="font-sans font-extrabold text-base" fill="currentColor">Pay</text>
    </svg>
  );
}

function BankIcon({ className = "h-7 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M3 10h18M3 7l9-4 9 4M5 10v11M9 10v11M15 10v11M19 10v11" />
    </svg>
  );
}

function CreditCardIcon({ className = "h-7 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20M6 14h2" />
    </svg>
  );
}
