import {useState, type FormEvent, type ReactNode} from 'react';
import {CART_ACTIONS} from '~/lib/cart-actions';
import type {Cart} from '~/lib/types';

type CartAction = (typeof CART_ACTIONS)[keyof typeof CART_ACTIONS];

async function postCart(action: CartAction, inputs: Record<string, unknown>) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({cartAction: action, inputs}),
  });
  if (!res.ok) throw new Error('Cart update failed');
  return (await res.json()) as {cart: Cart};
}

export function CartForm({
  action,
  inputs,
  children,
  onSuccess,
}: {
  action: CartAction;
  inputs: Record<string, unknown>;
  children: ReactNode | ((state: {pending: boolean}) => ReactNode);
  onSuccess?: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      await postCart(action, inputs);
      onSuccess?.();
      window.location.reload();
    } finally {
      setPending(false);
    }
  }

  const content = typeof children === 'function' ? children({pending}) : children;

  return <form onSubmit={handleSubmit}>{content}</form>;
}

CartForm.ACTIONS = CART_ACTIONS;
export {postCart};
