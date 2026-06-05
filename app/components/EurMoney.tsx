import {Money} from '@shopify/hydrogen';

type EurMoneyProps = {
  data: {
    amount: string;
    currencyCode: string;
  };
};

/** Displays storefront prices in EUR for the demo shop. */
export function EurMoney({data}: EurMoneyProps) {
  return <Money data={{amount: data.amount, currencyCode: 'EUR'}} />;
}
