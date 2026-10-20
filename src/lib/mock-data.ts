/** Demo payment details pre-filled at checkout (Stripe's test card). */
export const MOCK_PAYMENT = {
  cardNumber: '4242 4242 4242 4242',
  /** Always valid: December, three years from now. */
  get cardExpiry() {
    return `12/${String((new Date().getFullYear() + 3) % 100).padStart(2, '0')}`;
  },
  cardCvc: '123',
};
