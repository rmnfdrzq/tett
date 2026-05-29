import { describe, expect, it } from "vitest";
import { validateCheckout } from "./validation";

describe("checkout validation", () => {
  it("accepts valid credit card checkout data", () => {
    const result = validateCheckout({
      customerName: "A. Smith",
      phone: "555 0100",
      email: "smith@example.com",
      shippingAddress: "10 Kiln Road",
      projectNotes: "Kitchen backsplash",
      paymentMethod: "card",
      cardNumber: "4111111111111111",
      expiration: "12/30",
      cvv: "123",
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects missing required fields, invalid email, and invalid card details", () => {
    const result = validateCheckout({
      customerName: "",
      phone: "",
      email: "bad-email",
      shippingAddress: "",
      projectNotes: "",
      paymentMethod: "card",
      cardNumber: "1234",
      expiration: "99/12",
      cvv: "1",
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toMatchObject({
      customerName: "Customer name is required.",
      phone: "Phone is required.",
      email: "Enter a valid email address.",
      shippingAddress: "Shipping address is required.",
      cardNumber: "Enter a valid card number.",
      expiration: "Use MM/YY expiration format.",
      cvv: "Enter a valid CVV.",
    });
  });

  it("does not require card fields for non-card payment methods", () => {
    const result = validateCheckout({
      customerName: "A. Smith",
      phone: "555 0100",
      email: "smith@example.com",
      shippingAddress: "10 Kiln Road",
      projectNotes: "",
      paymentMethod: "paypal",
      cardNumber: "",
      expiration: "",
      cvv: "",
    });

    expect(result.valid).toBe(true);
  });
});
