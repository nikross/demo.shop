type EurMoneyProps = {
  amount: string;
};

export function EurMoney({amount}: EurMoneyProps) {
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(amount));

  return <span>{formatted}</span>;
}
