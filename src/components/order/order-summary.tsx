"use client";
 
import { useAppSelector } from "@/lib/store/hooks";
import { selectGrandTotal, selectShipping, selectSubtotal } from "@/lib/store/selectors";
import { formatCurrency } from "@/lib/cart/calculations";
 
type OrderSummaryProps = {
  values: {
    customerName: string;
    phone: string;
    email: string;
    shippingAddress: string;
    projectNotes: string;
  };
  hideHeader?: boolean;
  onValuesChange?: (values: OrderSummaryProps["values"]) => void;
};
 
export function OrderSummary({ values, hideHeader = false, onValuesChange }: OrderSummaryProps) {
  const subtotal = useAppSelector(selectSubtotal);
  const shipping = useAppSelector(selectShipping);
  const grandTotal = useAppSelector(selectGrandTotal);

  const handleChange = (field: keyof OrderSummaryProps["values"], value: string) => {
    if (onValuesChange) {
      onValuesChange({ ...values, [field]: value });
    }
  };

  const formatPhone = (value: string): string => {
    const hasPlus = value.startsWith('+');
    const digits = value.replace(/\D/g, '');
    return hasPlus ? `+${digits}` : digits;
  };

  const formatEmail = (value: string): string => {
    return value.replace(/\s/g, '').toLowerCase();
  };
 
  return (
    <section className="font-hand">
      {!hideHeader && (
        <div className="flex">
          <h2 className="order-summary-title">
            <span className="order-summary-title-text">Order Summary</span>
          </h2>
          <div className="flex-1 border-b-2 border-ink bg-tab" />
        </div>
      )}
      <div className="order-summary-box">
        <div className="order-summary-lines relative -translate-y-[6px]">
          <Line label="Customer Name" value={values.customerName} onChange={(val) => handleChange("customerName", val)} />
          <div className="grid grid-cols-2 gap-2">
            <Line label="Phone" value={values.phone} onChange={(val) => handleChange("phone", formatPhone(val))} />
            <Line label="Email" value={values.email} onChange={(val) => handleChange("email", formatEmail(val))} />
          </div>
          <Line label="Shipping Address" value={values.shippingAddress} onChange={(val) => handleChange("shippingAddress", val)} />
          <Line label="Project Notes" value={values.projectNotes} onChange={(val) => handleChange("projectNotes", val)} />
        </div>
        
        <hr className="border-t-2 border-ink mb-0 opacity-100" />
        
        <div className="order-summary-totals">
          <p>SUBTOTAL: <span className="summary-bracket">{formatCurrency(subtotal)}</span></p>
          <p>SHIPPING: <span className="summary-bracket">{formatCurrency(shipping)}</span></p>
          <p>GRAND TOTAL: <span className="summary-bracket">{formatCurrency(grandTotal)}</span></p>
        </div>
      </div>
    </section>
  );
}
 
function Line({ label, value, onChange }: { label: string; value: string; onChange?: (value: string) => void }) {
  return (
    <div className="flex items-end gap-1 min-w-0">
      <span className="shrink-0">{label}:</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="min-h-[22px] min-w-0 flex-1 border-b border-ink px-1 text-left bg-transparent outline-none focus:bg-paper/40"
      />
    </div>
  );
}
