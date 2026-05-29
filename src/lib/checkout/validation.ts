export type PaymentMethod = "card" | "paypal" | "apple-pay" | "bank-transfer";

export type CheckoutFormValues = {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  projectNotes: string;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiration: string;
  cvv: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export type CheckoutValidationResult = {
  valid: boolean;
  errors: CheckoutErrors;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPotentiallyValidCard(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 13 && digits.length <= 19;
}

function isValidExpiration(value: string): boolean {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) {
    return false;
  }

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const lastDay = new Date(year, month, 0);

  return lastDay >= new Date(now.getFullYear(), now.getMonth(), 1);
}

function isValidCvv(value: string): boolean {
  return /^\d{3,4}$/.test(value);
}

export function validateCheckout(values: CheckoutFormValues): CheckoutValidationResult {
  const errors: CheckoutErrors = {};

  if (!values.customerName.trim()) {
    errors.customerName = "Customer name is required.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone is required.";
  }

  if (!isValidEmail(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.shippingAddress.trim()) {
    errors.shippingAddress = "Shipping address is required.";
  }

  if (values.paymentMethod === "card") {
    if (!isPotentiallyValidCard(values.cardNumber)) {
      errors.cardNumber = "Enter a valid card number.";
    }

    if (!isValidExpiration(values.expiration)) {
      errors.expiration = "Use MM/YY expiration format.";
    }

    if (!isValidCvv(values.cvv)) {
      errors.cvv = "Enter a valid CVV.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
