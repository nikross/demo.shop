/// <reference types="astro/client" />

type CartService = import('~/lib/types').CartService;

declare namespace App {
  interface Locals {
    cart: CartService;
    isLoggedIn: boolean;
  }
}
