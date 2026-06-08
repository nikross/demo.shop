import {CartForm} from '~/components/CartForm';
import {useAside} from '~/components/Aside';

export function AddToCartButton({
  children,
  disabled,
  lines,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<{merchandiseId: string; quantity: number}>;
}) {
  const {open} = useAside();

  return (
    <CartForm action={CartForm.ACTIONS.LinesAdd} inputs={{lines}} onSuccess={() => open('cart')}>
      {({pending}) => (
        <button
          type="submit"
          className="mt-2 w-full cursor-pointer rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled ?? pending}
        >
          {children}
        </button>
      )}
    </CartForm>
  );
}
