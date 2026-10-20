import {useEffect, useState, type FormEvent, type ReactNode} from 'react';
import {CART_ACTIONS} from '~/lib/cart-actions';
import type {Cart} from '~/lib/types';

type CartAction = (typeof CART_ACTIONS)[keyof typeof CART_ACTIONS];

const CART_UPDATED_EVENT = 'mock-shop:cart-updated';

async function postCart(action: CartAction, inputs: Record<string, unknown>) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({cartAction: action, inputs}),
  });
  if (!res.ok) throw new Error('Cart update failed');
  return (await res.json()) as {cart: Cart};
}

function dispatchCartUpdated(cart: Cart) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, {detail: cart}));
  }
}

export function useLiveCart(initialCart: Cart | null) {
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  useEffect(() => {
    const onUpdate = (event: Event) => {
      setCart((event as CustomEvent<Cart>).detail);
    };
    window.addEventListener(CART_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
  }, []);

  return cart;
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
      const {cart} = await postCart(action, inputs);
      dispatchCartUpdated(cart);
      onSuccess?.();
    } finally {
      setPending(false);
    }
  }

  const content = typeof children === 'function' ? children({pending}) : children;

  return <form onSubmit={handleSubmit}>{content}</form>;
}

CartForm.ACTIONS = CART_ACTIONS;
export {postCart, dispatchCartUpdated};
